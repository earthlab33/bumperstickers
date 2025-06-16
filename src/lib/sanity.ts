import { createClient } from '@sanity/client';

export const sanityClient = createClient({
    projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
    dataset: import.meta.env.PUBLIC_SANITY_DATASET,
    apiVersion: '2024-03-19',
    useCdn: true,
});

export interface PollQuestion {
    questionText: string;
    questionType: 'text' | 'single-choice' | 'multiple-choice';
    options?: string[];
    required: boolean;
}

export interface Poll {
    _id: string;
    title: string;
    description: string;
    bumperstickerId: string;
    questions: PollQuestion[];
    isActive: boolean;
    createdBy: string;
    createdAt: string;
}

export async function getPollForBumpersticker(bumperstickerId: string): Promise<Poll | null> {
    try {
        const query = `*[_type == "poll" && bumperstickerId == $bumperstickerId && isActive == true][0]{
            _id,
            title,
            description,
            bumperstickerId,
            questions,
            isActive,
            createdBy,
            createdAt
        }`;
        const poll = await sanityClient.fetch(query, { bumperstickerId });
        return poll;
    } catch (error) {
        console.error('Error fetching poll:', error);
        return null;
    }
} 