import { getSiteConfig } from "../lib/supabase";

/**
 * Dynamic robots.txt endpoint.
 * Generates directives that align with HeadConfig.tsx based on site
 * seo/aiScraping settings. Crawlers check robots.txt before fetching
 * pages, so this reduces wasted bandwidth when blocking bots.
 */
export const prerender = true;

export async function GET() {
	const bumperstickerId = import.meta.env.BUMPERSTICKER_ID;
	const config = await getSiteConfig(bumperstickerId ?? "");

	const defaultConfig: {
		seo: boolean;
		aiscrape: boolean;
		config?: { seo?: boolean; aiScraping?: boolean };
	} = {
		seo: true,
		aiscrape: true,
		config: { seo: true, aiScraping: true },
	};

	const merged = config ?? defaultConfig;
	const seo = merged.config?.seo ?? merged.seo ?? true;
	const aiScraping = merged.config?.aiScraping ?? merged.aiscrape ?? true;

	const lines: string[] = [];

	if (seo && aiScraping) {
		// Allow both SEO and AI bots
		lines.push("User-agent: *", "Allow: /");
	} else if (seo && !aiScraping) {
		// Allow SEO bots, block AI bots
		lines.push("User-agent: *", "Allow: /", "");
		lines.push(
			"User-agent: GPTBot",
			"Disallow: /",
			"",
			"User-agent: CCBot",
			"Disallow: /",
			"",
			"User-agent: Claude-Web",
			"Disallow: /",
			"",
			"User-agent: anthropic-ai",
			"Disallow: /",
			"",
			"User-agent: Google-Extended",
			"Disallow: /",
			"",
			"User-agent: FacebookBot",
			"Disallow: /",
			"",
			"User-agent: facebookexternalhit",
			"Disallow: /"
		);
	} else if (!seo && aiScraping) {
		// Block SEO bots, allow AI bots
		lines.push("User-agent: *", "Allow: /", "");
		lines.push(
			"User-agent: Googlebot",
			"Disallow: /",
			"",
			"User-agent: Bingbot",
			"Disallow: /",
			"",
			"User-agent: Yandex",
			"Disallow: /"
		);
	} else {
		// Block both SEO and AI bots
		lines.push("User-agent: *", "Disallow: /");
	}

	const content = lines.join("\n");

	return new Response(content, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "public, max-age=86400",
		},
	});
}
