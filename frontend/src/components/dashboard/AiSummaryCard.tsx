"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { assistantApi, extractErrorMessage } from "@/lib/api";

export function AiSummaryCard() {
    const [summary, setSummary] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleGenerate() {
        setLoading(true);
        setError(null);
        try {
            const result = await assistantApi.summary();
            setSummary(result);
        } catch (err) {
            setError(extractErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card>
            <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-semibold text-ink">AI team summary</h3>
                <Button variant="secondary" onClick={handleGenerate} disabled={loading}>
                    {loading ? "Generating…" : summary ? "Regenerate" : "Generate"}
                </Button>
            </div>
            {error && <p className="mt-3 text-sm text-accent">{error}</p>}
            {summary && <p className="mt-3 whitespace-pre-wrap text-sm text-ink">{summary}</p>}
            {!summary && !error && !loading && (
                <p className="mt-3 text-sm text-slate">
                    Get a quick AI-written recap of completed work, recurring blockers, and workload
                    imbalances across the last few weeks.
                </p>
            )}
        </Card>
    );
}