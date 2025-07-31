import type { SiteConfig } from "../lib/supabase";

// Props interface for the sub-components
interface SEOProps {
  siteConfig: SiteConfig;
}

const SEOMetaTags = ({ siteConfig }: SEOProps) => (
  <>
    <meta name="description" content={siteConfig.description} />
    <meta name="keywords" content={siteConfig.keywords} />
    <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta httpEquiv="Pragma" content="no-cache" />
    <meta httpEquiv="Expires" content="0" />
    <meta name="author" content="BumperStickerPages.com" />
  </>
);

const SEOBotTags = () => (
  <>
    <meta name="robots" content="index, follow" />
    <meta name="googlebot" content="index, follow" />
    <meta name="bingbot" content="index, follow" />
    <meta name="yandexbot" content="index, follow" />
  </>
);

const AIBotAllowTags = () => (
  <>
    <meta name="GPTBot" content="index, follow" />
    <meta name="CCBot" content="index, follow" />
    <meta name="anthropic-ai" content="index, follow" />
    <meta name="Claude-Web" content="index, follow" />
    <meta name="Google-Extended" content="index, follow" />
    <meta name="FacebookBot" content="index, follow" />
    <meta name="facebookexternalhit" content="index, follow" />
  </>
);

const AIBotBlockTags = () => (
  <>
    <meta name="ChatGPT-User" content="CCBot-NoFollow" />
    <meta name="GPTBot" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
    <meta name="CCBot" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
    <meta name="anthropic-ai" content="noindex, nofollow" />
    <meta name="Claude-Web" content="noindex, nofollow" />
    <meta name="Google-Extended" content="noindex, nofollow" />
    <meta name="FacebookBot" content="noindex, nofollow" />
    <meta name="facebookexternalhit" content="noindex, nofollow" />
  </>
);

const SEOBotBlockTags = () => (
  <>
    <meta name="robots" content="noindex, nofollow" />
    <meta name="googlebot" content="noindex, nofollow" />
    <meta name="bingbot" content="noindex, nofollow" />
    <meta name="yandexbot" content="noindex, nofollow" />
  </>
);

// Props interface for the main component
interface HeadConfigurationProps {
  siteConfig: SiteConfig;
}

// Main component
export default function HeadConfiguration({ siteConfig }: HeadConfigurationProps) {
  // Use config values if available, fallback to legacy values
  const seo = siteConfig.config?.seo ?? siteConfig.seo;
  const aiScraping = siteConfig.config?.aiScraping ?? siteConfig.aiscrape;

  if (seo && aiScraping) {
    // Allow both SEO and AI bots
    return (
      <>
        <SEOMetaTags siteConfig={siteConfig} />
        <SEOBotTags />
        <AIBotAllowTags />
      </>
    );
  } else if (seo && !aiScraping) {
    // Allow SEO bots, block AI bots
    return (
      <>
        <SEOMetaTags siteConfig={siteConfig} />
        <SEOBotTags />
        <AIBotBlockTags />
      </>
    );
  } else if (!seo && aiScraping) {
    // Block SEO bots, allow AI bots (unusual case)
    return (
      <>
        <SEOMetaTags siteConfig={siteConfig} />
        <SEOBotBlockTags />
        <AIBotAllowTags />
      </>
    );
  } else {
    // Block both SEO and AI bots
    return (
      <>
        <SEOMetaTags siteConfig={siteConfig} />
        <SEOBotBlockTags />
        <AIBotBlockTags />
      </>
    );
  }
}