import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

export interface StyleConfig {
    seo: boolean;
    content: string;
    heading: string;
    justify: string;
    leading: string;
    bodyText: string;
    fontColor: string;
    fontStyle: string;
    aiScraping: boolean;
    borderColor: string;
    borderStyle: string;
    borderWidth: string;
    headingText: string;
    acceptsLikes: boolean;
    acceptsTerms: boolean;
    bodyFontSize: string;
    borderRadius: string;
    backgroundColor: string;
    headerAlignment: string;
    headingFontSize: string;
}

export interface SiteConfig {
    id: string;
    user_id: string;
    domain_id: string;
    title: string;
    content: string;
    status: string;
    created_at: string;
    updated_at: string;
    accepts_likes: boolean;
    domain: string;
    theme: string;
    deployment_url: string;
    messages: boolean;
    seo: boolean;
    aiscrape: boolean;
    keywords: string;
    description: string;
    author: string;
    likes: number;
    superscript: string;
    config?: StyleConfig;
}

export async function testConnection() {
    try {
        const { data, error } = await supabase
            .from('bumperstickers')
            .select('id')
            .limit(1);

        console.log('Connection test result:', { data, error });
        return !error;
    } catch (error) {
        console.error('Connection test error:', error);
        return false;
    }
}

export async function listAllDomains(): Promise<string[]> {
    try {
        console.log('Attempting to list all domains...');
        // First test the connection
        await testConnection();

        const { data, error } = await supabase
            .from('bumperstickers')
            .select('id, domain');

        if (error) {
            console.error('Error listing domains:', error);
            return [];
        }

        console.log('Raw data from database:', data);
        console.log('Number of rows found:', data?.length);
        if (data && data.length > 0) {
            console.log('First row:', data[0]);
        }
        return data?.map(d => d.domain) || [];
    } catch (error) {
        console.error('Error listing domains:', error);
        return [];
    }
}

export async function getSiteConfig(id: string): Promise<SiteConfig | null> {
    try {
        console.log('Attempting to fetch config for ID:', id);

        // Add cache-busting parameter
        const cacheBust = Date.now();

        const { data, error } = await supabase
            .from('bumperstickers')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }

        if (!data) {
            console.log('No data found for ID:', id);
            return null;
        }

        console.log('Successfully fetched config:', data);
        return data;
    } catch (error) {
        console.error('Error fetching site config:', error);
        return null;
    }
}

export async function createSiteConfig(
    userId: string,
    config: Omit<SiteConfig, 'id' | 'created_at' | 'updated_at'>
): Promise<SiteConfig | null> {
    try {
        const { data, error } = await supabase
            .from('bumperstickers')
            .insert([
                {
                    user_id: userId,
                    content: config.content,
                    superscript: config.superscript,
                    theme: config.theme,
                    title: config.title,
                    domain: config.domain,
                    status: config.status,
                    accepts_likes: config.accepts_likes,
                    messages: config.messages,
                    likes: config.likes,
                    seo: config.seo,
                    aiscrape: config.aiscrape,
                    deployment_url: config.deployment_url,
                    keywords: config.keywords,
                    description: config.description,
                    author: config.author
                }
            ])
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error creating site config:', error);
        return null;
    }
} 