
<template>
  <aside class="w-60 shrink-0 bg-[#0b0f1a] border-r border-[#1a2035] flex flex-col">

    <div class="px-5 py-6 border-b border-[#1a2035]">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
          <span class="text-white font-bold text-sm">F</span>
        </div>
        <span class="text-white font-bold text-lg tracking-tight">FlowDesk</span>
      </div>

      <div class="mt-3 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
        <span class="text-indigo-400 text-xs font-medium">Free Plan</span>
      </div>
    </div>

    <nav class="flex-1 px-3 py-4 space-y-0.5">
      <p class="text-[10px] text-gray-600 font-semibold uppercase tracking-widest px-3 mb-2">
        Main Menu
      </p>

      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
               text-gray-500 hover:text-white hover:bg-white/5
               transition-all duration-150 group"
        active-class="!text-indigo-400 !bg-indigo-500/10"
      >
        <UIcon :name="item.icon" class="w-4 h-4 shrink-0" />
        <span>{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <div class="px-4 py-4 border-t border-[#1a2035]">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-indigo-600 flex items-center
                    justify-center text-white text-xs font-bold shrink-0">
          {{ userInitials }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm text-white font-medium truncate">{{ userName }}</p>
          <p class="text-xs text-gray-500 truncate">{{ userEmail }}</p>
        </div>
        <UButton
          icon="i-heroicons-arrow-right-on-rectangle"
          color="neutral"
          variant="ghost"
          size="sm"
          @click="handleLogout"
        />
      </div>
    </div>

  </aside>
</template>

<script setup lang="ts">
const navItems = [
  { label: 'Dashboard',  to: '/dashboard',           icon: 'i-heroicons-squares-2x2' },
  { label: 'Projects',   to: '/dashboard/projects',  icon: 'i-heroicons-folder' },
  { label: 'Tasks',      to: '/dashboard/tasks',     icon: 'i-heroicons-check-circle' },
  { label: 'Analytics',  to: '/dashboard/analytics', icon: 'i-heroicons-chart-bar' },
  { label: 'Settings',   to: '/dashboard/settings',  icon: 'i-heroicons-cog-6-tooth' },
]

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const userName = computed(() =>
  user.value?.user_metadata?.full_name || 'User'
)
const userEmail = computed(() =>
  user.value?.email || ''
)
const userInitials = computed(() => {
  const name = userName.value
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
})

async function handleLogout() {
  await supabase.auth.signOut()
  await navigateTo('/login')
}
</script>