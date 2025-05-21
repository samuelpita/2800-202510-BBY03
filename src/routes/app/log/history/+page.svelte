<script lang="ts">
    import { formatDistance } from 'date-fns';
    import type { TreeStage } from '$lib/server/db/types';
    import type { Point } from 'geojson';

    interface TreeSpecies {
        commonName: string;
        scientificName: string;
    }

    interface TreeInfo {
        _id: string;
        location: Point;
        species: TreeSpecies | null;
    }

    interface LogDetails {
        title?: string;
        body: string;
        tags?: string[];
    }
    
    interface LogEntry {
        _id: string;
        treeId: string;
        userId: string;
        type: string;
        details?: LogDetails;
        stage?: TreeStage;
        health?: string;
        dateCreated: Date;
        dateCompleted: Date | null;
        tree: TreeInfo | null;
    }

    let { data } = $props();
    const logs = $derived((data.logs || []) as LogEntry[]);

    function formatDate(date: Date | null): string {
        if (!date) return 'Not completed';
        return new Date(date).toLocaleDateString() + ' at ' + new Date(date).toLocaleTimeString();
    }

    function getRelativeTime(date: Date): string {
        if (!date) return '';
        return formatDistance(new Date(date), new Date(), { addSuffix: true });
    }

    function getActivityTypeLabel(type: string): string {
        const types: Record<string, string> = {
            'watered': 'Watered tree',
            'mulch': 'Added mulch',
            'prune': 'Pruned tree',
            'condition': 'Condition report',
            'other': 'Other activity'
        };
        return types[type] || type;
    }

    function getStageLabel(stage: string): string | null {
        if (!stage) return null;
        const stages: Record<string, string> = {
            'seed': 'Seed',
            'seedling': 'Seedling',
            'sapling': 'Sapling',
            'mature': 'Mature',
            'snag': 'Snag'
        };
        return stages[stage] || stage;
    }

    function getHealthLabel(health: string): string | null {
        if (!health) return null;
        const healths: Record<string, string> = {
            'excellent': 'Excellent',
            'good': 'Good',
            'fair': 'Fair',
            'poor': 'Poor',
            'critical': 'Critical',
            'dead': 'Dead'
        };
        return healths[health] || health;
    }

    function getActivityIcon(type: string): string {
        const icons: Record<string, string> = {
            'watered': '💧',
            'mulch': '🌱',
            'prune': '✂️',
            'condition': '🔍',
            'other': '📝'
        };
        return icons[type] || '🌳';
    }
</script>

<div class="container mx-auto px-4 py-6 max-w-4xl text-white">
    <div class="flex items-center mb-6">
        <a href="/app/account" class="mr-4 text-2xl">←</a>
        <h1 class="text-2xl font-bold">Activity History</h1>
    </div>

    {#if logs.length === 0}
        <div class="bg-dark-2 rounded-lg p-8 text-center">
            <p class="text-gray-400 mb-4">You haven't logged any tree activities yet.</p>
        </div>
    {:else}
        <div class="space-y-4">
            {#each logs as log}
                <div class="bg-dark-2 rounded-lg p-4">
                    <div class="flex items-start">
                        <div class="text-2xl mr-3">{getActivityIcon(log.type)}</div>
                        <div class="flex-1">
                            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                <h3 class="font-medium text-lg">
                                    {getActivityTypeLabel(log.type)}
                                </h3>
                                <span class="text-xs text-gray-400">
                                    {getRelativeTime(log.dateCreated)}
                                </span>
                            </div>

                            {#if log.tree && log.tree.species}
                                <p class="text-sm text-gray-300">
                                    {log.tree.species.commonName} 
                                    <span class="text-gray-500 text-xs italic">({log.tree.species.scientificName})</span>
                                </p>
                            {/if}

                            {#if log.type === 'condition'}
                                <div class="mt-2 bg-dark-1 p-2 rounded">
                                    <div class="grid grid-cols-2 gap-2 text-sm">
                                        {#if log.stage}
                                            <div>
                                                <span class="text-gray-400">Stage:</span> 
                                                <span class="text-gray-200">{getStageLabel(log.stage)}</span>
                                            </div>
                                        {/if}
                                        {#if log.health}
                                            <div>
                                                <span class="text-gray-400">Health:</span> 
                                                <span class="text-gray-200">{getHealthLabel(log.health)}</span>
                                            </div>
                                        {/if}
                                    </div>
                                </div>
                            {/if}

                            {#if log.details && log.details.body}
                                <p class="text-sm mt-2 text-gray-300">
                                    {log.details.body}
                                </p>
                            {/if}

                            <div class="text-xs text-gray-500 mt-2">
                                {log.dateCompleted ? `Completed: ${formatDate(log.dateCompleted)}` : 'Not completed yet'}
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>

    {/if}
</div> 