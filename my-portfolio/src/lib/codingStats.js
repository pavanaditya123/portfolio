// Live coding-profile stats.
//
// Every platform here is fetched straight from the browser, so the numbers on
// the site track the real profiles without a build or a redeploy. The public
// APIs differ in reliability, so each platform gets a chain of endpoints and a
// localStorage cache: a successful fetch is reused for CACHE_TTL, and if every
// endpoint is down the last good response is served stale rather than showing
// an empty card.

const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours
const TIMEOUT = 12000;

const num = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
};

async function getJSON(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);
    try {
        const res = await fetch(url, {
            signal: controller.signal,
            headers: { Accept: 'application/json' },
        });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        return await res.json();
    } finally {
        clearTimeout(timer);
    }
}

// Walk a list of [url, parser] pairs, returning the first parse that succeeds.
async function firstSuccess(sources) {
    let lastErr;
    for (const [url, parse] of sources) {
        try {
            const parsed = parse(await getJSON(url));
            if (parsed) return parsed;
            throw new Error('empty payload');
        } catch (err) {
            lastErr = err;
        }
    }
    throw lastErr ?? new Error('no sources');
}

/* --------------------------- activity calendars -------------------------- */

const DAY = 86400000;
const isoDay = (d) => d.toISOString().slice(0, 10);

/**
 * LeetCode reports activity as { unixDayStart: submissionCount }. Expand that
 * sparse map into a dense run of the last `span` days so it can be drawn on
 * the same grid as the GitHub calendar.
 */
function calendarFromEpochMap(map, span = 365) {
    if (!map || typeof map !== 'object') return [];
    const counts = new Map();
    for (const [ts, count] of Object.entries(map)) {
        const seconds = Number(ts);
        if (!Number.isFinite(seconds)) continue;
        counts.set(isoDay(new Date(seconds * 1000)), num(count));
    }

    const today = new Date();
    const end = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
    const days = [];
    for (let i = span - 1; i >= 0; i -= 1) {
        const date = isoDay(new Date(end - i * DAY));
        days.push({ date, count: counts.get(date) ?? 0 });
    }
    return days;
}

/** Longest and current run of consecutive active days, plus the totals. */
export function computeStreaks(days = []) {
    let longest = 0;
    let run = 0;
    let active = 0;
    let total = 0;

    for (const d of days) {
        total += d.count;
        if (d.count > 0) {
            run += 1;
            active += 1;
            if (run > longest) longest = run;
        } else {
            run = 0;
        }
    }

    // A streak stays alive until today's box has actually been missed, so an
    // empty box for today alone does not reset it.
    let current = 0;
    for (let i = days.length - 1; i >= 0; i -= 1) {
        if (days[i].count > 0) current += 1;
        else if (i !== days.length - 1) break;
    }

    return { longest, current, active, total };
}

const cacheKey = (platform, handle) => `portfolio:stats:${platform}:${handle}`;

function readCache(platform, handle) {
    try {
        const raw = localStorage.getItem(cacheKey(platform, handle));
        if (!raw) return null;
        const { t, data } = JSON.parse(raw);
        if (!t || !data) return null;
        return { data, fetchedAt: t, expired: Date.now() - t > CACHE_TTL };
    } catch {
        return null;
    }
}

function writeCache(platform, handle, data) {
    try {
        localStorage.setItem(
            cacheKey(platform, handle),
            JSON.stringify({ t: Date.now(), data }),
        );
    } catch {
        // Private mode or a full quota -- the fetch still succeeded, so ignore.
    }
}

/* ------------------------------- LeetCode ------------------------------- */

// The three community mirrors agree on field names, so one parser covers all.
const parseLeetCode = (d) => {
    if (!d || d.status === 'error' || d.errors) return null;
    const solved = num(d.totalSolved);
    if (!solved) return null;
    return {
        totalSolved: solved,
        totalQuestions: num(d.totalQuestions),
        easy: { solved: num(d.easySolved), total: num(d.totalEasy) },
        medium: { solved: num(d.mediumSolved), total: num(d.totalMedium) },
        hard: { solved: num(d.hardSolved), total: num(d.totalHard) },
        ranking: num(d.ranking),
        acceptanceRate: num(d.acceptanceRate),
        calendar: calendarFromEpochMap(d.submissionCalendar),
    };
};

/**
 * Contest history lives behind a different endpoint on a slower host, so it is
 * fetched as its own platform. That keeps a cold start on this mirror from
 * holding up the main LeetCode card.
 */
async function fetchLeetCodeContest(u) {
    const d = await getJSON(`https://alfa-leetcode-api.onrender.com/${u}/contest`);
    const rating = num(d?.contestRating);
    if (!rating) throw new Error('no contest history');
    return {
        rating: Math.round(rating),
        attended: num(d.contestAttend),
        globalRanking: num(d.contestGlobalRanking),
        totalParticipants: num(d.totalParticipants),
        topPercentage: num(d.contestTopPercentage),
    };
}

const fetchLeetCode = (u) =>
    firstSuccess([
        [`https://leetcode-api-faisalshohag.vercel.app/${u}`, parseLeetCode],
        [`https://alfa-leetcode-api.onrender.com/userProfile/${u}`, parseLeetCode],
        [`https://leetcode-stats-api.herokuapp.com/${u}`, parseLeetCode],
    ]);

/* ------------------------------ Codeforces ------------------------------ */

// Codeforces has a real, CORS-enabled API, so this one is the reliable card.
// Solved count needs a second call: user.status lists every submission, and a
// problem counts once no matter how many times it was submitted.
async function fetchCodeforces(handle) {
    const info = await getJSON(
        `https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`,
    );
    if (info?.status !== 'OK' || !info.result?.length) throw new Error('bad handle');
    const u = info.result[0];

    let solved = 0;
    try {
        const sub = await getJSON(
            `https://codeforces.com/api/user.status?handle=${encodeURIComponent(handle)}&from=1&count=10000`,
        );
        if (sub?.status === 'OK' && Array.isArray(sub.result)) {
            const seen = new Set();
            for (const s of sub.result) {
                if (s?.verdict === 'OK' && s.problem) {
                    seen.add(`${s.problem.contestId ?? 'x'}-${s.problem.index ?? '?'}`);
                }
            }
            solved = seen.size;
        }
    } catch {
        // Submission history is a bonus; rating alone still makes a good card.
    }

    return {
        handle: String(u.handle ?? handle),
        rating: num(u.rating),
        maxRating: num(u.maxRating),
        rank: typeof u.rank === 'string' ? u.rank : '',
        maxRank: typeof u.maxRank === 'string' ? u.maxRank : '',
        solved,
        contribution: num(u.contribution),
    };
}

/* ---------------------------- GeeksforGeeks ----------------------------- */

const parseGFG = (d) => {
    if (!d) return null;
    const info = d.info ?? d;
    const solved = num(info.totalProblemsSolved ?? d.totalProblemsSolved);
    if (!solved) return null;
    const buckets = d.solvedStats ?? d;
    const count = (k) => num(buckets?.[k]?.count ?? buckets?.[k]);
    return {
        totalSolved: solved,
        codingScore: num(info.codingScore ?? d.codingScore),
        school: count('school') || count('School'),
        basic: count('basic') || count('Basic'),
        easy: count('easy') || count('Easy'),
        medium: count('medium') || count('Medium'),
        hard: count('hard') || count('Hard'),
    };
};

const fetchGFG = (u) =>
    firstSuccess([
        [`https://geeks-for-geeks-stats-api.vercel.app/?raw=y&userName=${u}`, parseGFG],
        [`https://geeks-for-geeks-stats-api.vercel.app/?userName=${u}`, parseGFG],
    ]);

/* -------------------------------- GitHub -------------------------------- */

async function fetchGitHub(u) {
    const user = await getJSON(`https://api.github.com/users/${encodeURIComponent(u)}`);
    let stars = 0;
    let languages = [];
    try {
        const repos = await getJSON(
            `https://api.github.com/users/${encodeURIComponent(u)}/repos?per_page=100&sort=updated`,
        );
        if (Array.isArray(repos)) {
            const langCount = {};
            for (const r of repos) {
                if (r?.fork) continue;
                stars += num(r?.stargazers_count);
                if (typeof r?.language === 'string' && r.language) {
                    langCount[r.language] = (langCount[r.language] ?? 0) + 1;
                }
            }
            languages = Object.entries(langCount)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([name, count]) => ({ name, count }));
        }
    } catch {
        // Unauthenticated GitHub allows 60 requests/hour; the profile call is
        // the one that matters, so a throttled repo list is not fatal.
    }
    // The REST API does not expose contribution counts -- those live only in
    // the authenticated GraphQL API -- so this community mirror stands in for
    // it. Failure here just means the heatmap is skipped.
    let contributions = [];
    let contributionTotal = 0;
    try {
        const contrib = await getJSON(
            `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(u)}?y=last`,
        );
        if (Array.isArray(contrib?.contributions)) {
            contributions = contrib.contributions
                .slice(-365)
                .map((d) => ({ date: String(d.date), count: num(d.count) }));
        }
        contributionTotal = num(contrib?.total?.lastYear);
    } catch {
        // The heatmap is a bonus; the counts above still render.
    }

    return {
        repos: num(user?.public_repos),
        followers: num(user?.followers),
        following: num(user?.following),
        stars,
        languages,
        contributions,
        contributionTotal,
    };
}

/* -------------------------------- Public -------------------------------- */

const FETCHERS = {
    leetcode: fetchLeetCode,
    leetcodeContest: fetchLeetCodeContest,
    codeforces: fetchCodeforces,
    geeksforgeeks: fetchGFG,
    github: fetchGitHub,
};

/**
 * Resolve one platform's stats.
 * Returns { data, stale, fetchedAt } on success, or throws if there is
 * neither a live response nor anything cached to fall back on.
 */
export async function getStats(platform, handle, { force = false } = {}) {
    const fetcher = FETCHERS[platform];
    if (!fetcher) throw new Error(`unknown platform: ${platform}`);
    if (!handle) throw new Error('no handle configured');

    const cached = readCache(platform, handle);
    if (cached && !cached.expired && !force) {
        return { data: cached.data, stale: false, fetchedAt: cached.fetchedAt };
    }

    try {
        const data = await fetcher(handle);
        writeCache(platform, handle, data);
        return { data, stale: false, fetchedAt: Date.now() };
    } catch (err) {
        if (cached) {
            return { data: cached.data, stale: true, fetchedAt: cached.fetchedAt };
        }
        throw err;
    }
}
