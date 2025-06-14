import { createClient } from '@sanity/client';

export const sanityClient = createClient({
    projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
    dataset: import.meta.env.PUBLIC_SANITY_DATASET,
    apiVersion: '2024-03-19',
    useCdn: true,
});

export interface Poll {
    _id: string;
    question: string;
    type: 'single' | 'multiple' | 'text';
    options?: {
        _key: string;
        text: string;
    }[];
    bumperstickerId: string;
}

export async function getPollForBumpersticker(bumperstickerId: string): Promise<Poll | null> {
    try {
        const query = `*[_type == "poll" && bumperstickerId == $bumperstickerId][0]`;
        const poll = await sanityClient.fetch(query, { bumperstickerId });
        return poll;
    } catch (error) {
        console.error('Error fetching poll:', error);
        return null;
    }
} 