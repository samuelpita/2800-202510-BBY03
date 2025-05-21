<script lang="ts">
    import { goto } from '$app/navigation';
    import type { TreeStage } from '$lib/server/db/types';
    
    interface Tree {
        _id: string;
        species_id?: string;
        speciesInfo?: {
            commonName: string;
            scientificName: string;
        };
        stage?: string;
        health?: string;
    }
    
    interface ActivityData {
        treeId: string | null;
        type: string;
        details: string;
        completed: boolean;
        completedDate: string;
        stage?: string;
        health?: string;
    }
    
    let { data } = $props();
    const treeId = $derived(data.url.searchParams.get('treeId'));
    
    let tree = $state<Tree | null>(null);
    let loading = $state(true);
    let activityType = $state('');
    let details = $state('');
    let stage = $state('');
    let health = $state('');
    let completed = $state(true);
    let completedDate = $state(new Date().toISOString().split('T')[0]);
    let completedTime = $state(new Date().toTimeString().slice(0, 5));
    let errorMessage = $state('');
    let successMessage = $state('');
    let isSubmitting = $state(false);
    
    // Tree stage options
    const stageOptions = [
        { value: 'seed', label: 'Seed' },
        { value: 'seedling', label: 'Seedling' },
        { value: 'sapling', label: 'Sapling' },
        { value: 'mature', label: 'Mature' },
        { value: 'snag', label: 'Snag (Dead Tree)' }
    ];
    
    // Tree health options
    const healthOptions = [
        { value: 'excellent', label: 'Excellent' },
        { value: 'good', label: 'Good' },
        { value: 'fair', label: 'Fair' },
        { value: 'poor', label: 'Poor' },
        { value: 'critical', label: 'Critical' },
        { value: 'dead', label: 'Dead' }
    ];
    
    $effect(() => {
        loadTree();
    });
    
    async function loadTree() {
        if (treeId) {
            try {
                loading = true;
                const response = await fetch(`/api/trees/${treeId}`);
                if (response.ok) {
                    tree = await response.json();
                    console.log('Retrieved tree data:', tree);
                    
                    if (tree && tree.stage) {
                        stage = tree.stage;
                        console.log('Setting initial stage to:', stage);
                    } else {
                        stage = 'sapling';
                    }
                    
                    if (tree && tree.health) {
                        health = tree.health;
                        console.log('Setting initial health to:', health);
                    } else {
                        health = 'good';
                    }
                } else {
                    console.error('Failed to fetch tree details');
                    errorMessage = 'Failed to load tree details. Please try again.';
                }
            } catch (error) {
                console.error('Error fetching tree:', error);
                errorMessage = 'Error loading tree data. Please refresh and try again.';
            } finally {
                loading = false;
            }
        } else {
            loading = false;
        }
    }
    
    async function submitActivity() {
        if (!activityType) {
            alert('Please select an activity type');
            return;
        }
        
        try {
            errorMessage = '';
            successMessage = '';
            isSubmitting = true;
            const completedDateTime = new Date(`${completedDate}T${completedTime}`);
            
            const activityData: ActivityData = {
                treeId,
                type: activityType,
                details,
                completed,
                completedDate: completedDateTime.toISOString()
            };
            
            const response = await fetch('/api/actions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(activityData)
            });
            
            const responseData = await response.json();
            console.log('API response:', responseData);
            
            if (response.ok) {
                successMessage = 'Activity logged successfully!';
                setTimeout(() => {
                    goto('/app/log/history');
                }, 2000);
            } else {
                errorMessage = responseData.message || 'Failed to log activity. Please try again.';
                console.error('Error response:', responseData);
            }
        } catch (error) {
            console.error('Error logging activity:', error);
            errorMessage = 'Network error while logging activity. Please check your connection and try again.';
        } finally {
            isSubmitting = false;
        }
    }
</script>

<div class="container mx-auto px-4 py-6 max-w-md text-white">
    <div class="flex items-center mb-6">
        <a href="/app/account" class="mr-4 text-2xl">←</a>
        <h1 class="text-2xl font-bold">Log Activity</h1>
    </div>
    
    {#if loading}
        <div class="flex justify-center p-8">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
    {:else if !tree}
        <div class="bg-red-900 border border-red-600 text-white px-4 py-3 rounded">
            <p>Tree not found. <a href="/app" class="underline">Return to dashboard</a></p>
        </div>
    {:else}
        <div class="bg-dark-2 p-4 rounded-lg mb-6">
            <div class="flex items-center">
                <img src="/icons/tree.svg" alt="Tree icon" class="h-8 w-8 mr-3 invert" />
                <div>
                    {#if tree.speciesInfo}
                        <h2 class="font-medium capitalize">{tree.speciesInfo.commonName}</h2>
                        <p class="text-sm text-gray-300 italic">{tree.speciesInfo.scientificName}</p>
                    {:else}
                        <h2 class="font-medium">Tree #{tree._id.substring(0, 6)}</h2>
                    {/if}
                    <p class="text-xs text-gray-400">
                        {tree.stage || 'Unknown stage'} · {tree.health || 'Unknown health'}
                    </p>
                </div>
            </div>
        </div>

        {#if successMessage}
            <div class="bg-green-900 border border-green-600 text-white px-4 py-3 rounded mb-6">
                <p>{successMessage}</p>
            </div>
        {/if}
        
        {#if errorMessage}
            <div class="bg-red-900 border border-red-600 text-white px-4 py-3 rounded mb-6">
                <p>{errorMessage}</p>
            </div>
        {/if}

        <form onsubmit={(e) => { e.preventDefault(); submitActivity(); }} class="space-y-6">
            <div>
                <label for="activityType" class="block text-sm font-medium mb-1">
                    Activity Type
                </label>
                <select 
                    id="activityType" 
                    bind:value={activityType}
                    class="w-full px-3 py-2 bg-dark-2 border rounded-md text-white"
                    required
                >
                    <option value="" disabled>Select activity</option>
                    <option value="watered">Watered tree</option>
                    <option value="mulch">Added mulch to soil</option>
                    <option value="prune">Pruned tree</option>
                    <option value="condition">Report condition</option>
                    <option value="other">Other activity</option>
                </select>
            </div>
            
            {#if activityType === 'condition'}
                <div>
                    <label for="stage" class="block text-sm font-medium mb-1">
                        Tree Growth Stage
                    </label>
                    <select 
                        id="stage" 
                        bind:value={stage}
                        class="w-full px-3 py-2 bg-dark-2 border rounded-md text-white"
                    >
                        <option value="">Select growth stage</option>
                        {#each stageOptions as option}
                            <option value={option.value}>{option.label}</option>
                        {/each}
                    </select>
                </div>
                
                <div>
                    <label for="health" class="block text-sm font-medium mb-1">
                        Tree Health
                    </label>
                    <select 
                        id="health" 
                        bind:value={health}
                        class="w-full px-3 py-2 bg-dark-2 border rounded-md text-white"
                    >
                        <option value="">Select health status</option>
                        {#each healthOptions as option}
                            <option value={option.value}>{option.label}</option>
                        {/each}
                    </select>
                </div>
            {/if}
            
            <div>
                <label for="details" class="block text-sm font-medium mb-1">
                    Details {activityType === 'condition' ? '(required)' : '(optional)'}
                </label>
                <textarea
                    id="details"
                    bind:value={details}
                    rows="3"
                    class="w-full px-3 py-2 bg-dark-2 border rounded-md text-white"
                    placeholder="Add any additional details about this activity"
                    required={activityType === 'condition'}
                ></textarea>
            </div>
            
            <div>
                <div class="flex items-center">
                    <input
                        id="completed"
                        type="checkbox"
                        bind:checked={completed}
                        class="h-4 w-4 bg-dark-2 rounded text-green-500"
                    >
                    <label for="completed" class="ml-2 block text-sm">
                        Completed
                    </label>
                </div>
            </div>
            
            {#if completed}
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label for="completedDate" class="block text-sm font-medium mb-1">
                            Date
                        </label>
                        <input
                            type="date"
                            id="completedDate"
                            bind:value={completedDate}
                            class="w-full px-3 py-2 bg-dark-2 border rounded-md text-white [color-scheme:dark]"
                            required
                        >
                    </div>
                    <div>
                        <label for="completedTime" class="block text-sm font-medium mb-1">
                            Time
                        </label>
                        <input
                            type="time"
                            id="completedTime"
                            bind:value={completedTime}
                            class="w-full px-3 py-2 bg-dark-2 border rounded-md text-white [color-scheme:dark]"
                            required
                        >
                    </div>
                </div>
            {/if}
            
            <div>
                <button
                    type="submit"
                    class="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Submitting...' : 'Log Activity'}
                </button>
            </div>
        </form>

        <div class="mt-6 text-center">
            <a href="/app/log/history" class="hover:underline text-sm">
                View activity history
            </a>
        </div>
    {/if}
</div> 