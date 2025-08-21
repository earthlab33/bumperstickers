import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
    try {
        const { bumperstickerId } = await request.json();

        if (!bumperstickerId) {
            return new Response(JSON.stringify({ error: 'bumperstickerId is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Increment the views column by 1
        // First get current views count
        const { data: currentData, error: fetchError } = await supabase
            .from('bumperstickers')
            .select('views')
            .eq('id', bumperstickerId)
            .single();

        if (fetchError) {
            console.error('Error fetching current views:', fetchError);
            return new Response(JSON.stringify({ error: 'Failed to fetch current views' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const currentViews = currentData?.views || 0;

        // Update with incremented value
        const { data, error } = await supabase
            .from('bumperstickers')
            .update({ views: currentViews + 1 })
            .eq('id', bumperstickerId)
            .select('views');

        if (error) {
            console.error('Supabase error:', error);
            return new Response(JSON.stringify({ error: 'Failed to increment views' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({
            success: true,
            views: data?.[0]?.views || 0
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('API error:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}; 