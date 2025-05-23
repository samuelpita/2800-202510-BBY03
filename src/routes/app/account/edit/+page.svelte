<script lang="ts">
    import { enhance } from '$app/forms';
    import { Mail, User, ArrowLeft } from 'lucide-svelte';
    import { goto } from '$app/navigation';
    
    let { data, form } = $props();
    
    let username = $state(data.user?.username || '');
    let profilePicture = $state(data.user?.profilePicture || '');
    let previewUrl = $state(profilePicture);
    let error = $state('');
    let successMessage = $state('');
    let fileInput: HTMLInputElement;
    let selectedFile: File | null = null;
    let redirecting = $state(false);
    
    function handleInput() {
        error = '';
        successMessage = '';
    }
    
    function handleFileChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            selectedFile = input.files[0];
            previewUrl = URL.createObjectURL(input.files[0]);
        }
        handleInput();
    }
    
    $effect(() => {
        if (form?.success) {
            successMessage = 'Profile updated successfully';
            redirecting = true;
            
            // Redirect after 2 seconds
            setTimeout(() => {
                goto('/app/account');
            }, 2000);
        } else if (form?.error) {
            error = form.error;
        }
    });
</script>

<div class="p-edge-d mx-auto max-w-2xl text-gray-200">
    <div class="pt-10">
        <div class="flex items-center mb-6">
            <a href="/app/account" class="mr-4 text-2xl">
                <ArrowLeft />
            </a>
            <h1 class="text-2xl font-bold">Edit Profile</h1>
        </div>
        
        {#if successMessage}
            <div class="bg-green-900 border text-white px-4 py-3 rounded mb-6">
                <p>{successMessage}</p>
            </div>
        {/if}
        
        {#if error}
            <div class="bg-red-900 border border-red-600 text-white px-4 py-3 rounded mb-6">
                <p>{error}</p>
            </div>
        {/if}
        
        <form 
            method="POST" 
            action="?/updateProfile"
            class="bg-dark-2 p-6 rounded-lg shadow-lg space-y-6"
            use:enhance
            enctype="multipart/form-data"
        >
            <div class="flex justify-center mb-6">
                <div class="relative">
                    <div class="flex justify-center items-center w-24 h-24 rounded-full overflow-hidden border-4 border-orange-600">
                        {#if previewUrl}
                            <img 
                                src={previewUrl} 
                                alt="Profile" 
                                class="w-full h-full object-cover" 
                                onerror={(e) => {
                                    const img = e.currentTarget as HTMLImageElement;
                                    img.src = 'https://dummyimage.com/128x128/555/fff&text=User';
                                }} 
                            />
                        {:else}
                            <div class="flex justify-center items-center w-full h-full bg-gray-700 text-white">
                                <span class="text-xl">User</span>
                            </div>
                        {/if}
                    </div>
                </div>
            </div>
            
            <div>
                <label for="username" class="flex items-center text-sm font-medium mb-2">
                    <User size={16} class="mr-2" />
                    Username
                </label>
                <input 
                    type="text" 
                    id="username" 
                    name="username" 
                    bind:value={username} 
                    oninput={handleInput}
                    class="w-full px-4 py-2 bg-dark-1 border border-gray-700 rounded-md text-white"
                    required
                />
            </div>
            
            <div>
                <label for="email" class="flex items-center text-sm font-medium mb-2">
                    <Mail size={16} class="mr-2" />
                    Email
                </label>
                <input 
                    type="email" 
                    id="email" 
                    value={data.user?.email || ''} 
                    class="w-full px-4 py-2 bg-dark-1 border border-gray-700 rounded-md text-white opacity-70"
                    disabled
                />
                <p class="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
            
            <div>
                <label for="profileImage" class="text-sm font-medium mb-2">
                    Profile Picture
                </label>
                <input 
                    type="file" 
                    id="profileImage" 
                    name="profileImage" 
                    accept="image/*"
                    onchange={handleFileChange}
                    bind:this={fileInput}
                    class="w-full px-4 py-2 bg-dark-2 border border-gray-700 rounded-md text-white file:bg-orange-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1 file:mr-3 file:cursor-pointer hover:file:bg-orange-700"
                />
                <p class="text-xs text-gray-500 mt-1">Select an image file from your device</p>
            </div>
            
            <div>
                <button 
                    type="submit"
                    class="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-sm transition-colors"
                >
                    Save Changes
                </button>
            </div>
        </form>
        
    </div>
</div> 