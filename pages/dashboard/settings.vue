<template>
  <div class="space-y-6 max-w-2xl">

    <div>
      <h1 class="text-2xl font-bold text-white">Settings</h1>
      <p class="text-gray-500 text-sm mt-1">
        Manage your account and preferences
      </p>
    </div>

    <div class="bg-[#0b0f1a] border border-[#1a2035] rounded-xl overflow-hidden">
      <div class="px-6 py-4 border-b border-[#1a2035]">
        <h2 class="text-white font-semibold">Profile</h2>
        <p class="text-gray-500 text-xs mt-0.5">Update your display name</p>
      </div>

      <div class="p-6 space-y-4">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-full bg-indigo-600 flex items-center
                      justify-center text-white text-xl font-bold shrink-0">
            {{ userInitials }}
          </div>
          <div>
            <p class="text-white font-medium text-sm">{{ displayName }}</p>
            <p class="text-gray-500 text-xs">{{ userEmail }}</p>
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="text-gray-400 text-sm">Display Name</label>
          <UInput
            v-model="profileForm.fullName"
            placeholder="Your name"
            color="neutral"
            variant="outline"
          />
        </div>

        <UButton
          label="Save Profile"
          color="primary"
          :loading="profileLoading"
          @click="saveProfile"
        />

        <p v-if="profileSuccess" class="text-emerald-400 text-xs">
          ✓ Profile updated successfully
        </p>
        <p v-if="profileError" class="text-red-400 text-xs">
          {{ profileError }}
        </p>
      </div>
    </div>

    <div class="bg-[#0b0f1a] border border-[#1a2035] rounded-xl overflow-hidden">
      <div class="px-6 py-4 border-b border-[#1a2035]">
        <h2 class="text-white font-semibold">Email Address</h2>
        <p class="text-gray-500 text-xs mt-0.5">
          Update the email linked to your account
        </p>
      </div>

      <div class="p-6 space-y-4">
        <div class="space-y-1.5">
          <label class="text-gray-400 text-sm">New Email Address</label>
          <UInput
            v-model="emailForm.newEmail"
            type="email"
            :placeholder="userEmail"
            color="neutral"
            variant="outline"
          />
        </div>

        <UButton
          label="Update Email"
          color="primary"
          :loading="emailLoading"
          @click="updateEmail"
        />

        <p v-if="emailSuccess" class="text-emerald-400 text-xs">
          ✓ Confirmation sent to {{ emailForm.newEmail }}. Check your inbox.
        </p>
        <p v-if="emailError" class="text-red-400 text-xs">{{ emailError }}</p>
      </div>
    </div>

    <div class="bg-[#0b0f1a] border border-[#1a2035] rounded-xl overflow-hidden">
      <div class="px-6 py-4 border-b border-[#1a2035]">
        <h2 class="text-white font-semibold">Password</h2>
        <p class="text-gray-500 text-xs mt-0.5">
          Choose a strong password for your account
        </p>
      </div>

      <div class="p-6 space-y-4">
        <div class="space-y-1.5">
          <label class="text-gray-400 text-sm">New Password</label>
          <UInput
            v-model="passwordForm.newPassword"
            type="password"
            placeholder="Min 8 characters"
            color="neutral"
            variant="outline"
          />
        </div>

        <div class="space-y-1.5">
          <label class="text-gray-400 text-sm">Confirm Password</label>
          <UInput
            v-model="passwordForm.confirmPassword"
            type="password"
            placeholder="Repeat new password"
            color="neutral"
            variant="outline"
          />
        </div>

        <UButton
          label="Update Password"
          color="primary"
          :loading="passwordLoading"
          @click="updatePassword"
        />

        <p v-if="passwordSuccess" class="text-emerald-400 text-xs">
          ✓ Password updated successfully
        </p>
        <p v-if="passwordError" class="text-red-400 text-xs">
          {{ passwordError }}
        </p>
      </div>
    </div>

    <div class="bg-[#0b0f1a] border border-red-500/20 rounded-xl overflow-hidden">
      <div class="px-6 py-4 border-b border-red-500/20">
        <h2 class="text-red-400 font-semibold">Danger Zone</h2>
        <p class="text-gray-500 text-xs mt-0.5">
          Irreversible actions — proceed with caution
        </p>
      </div>

      <div class="p-6 flex items-center justify-between">
        <div>
          <p class="text-white text-sm font-medium">Sign out of all sessions</p>
          <p class="text-gray-500 text-xs mt-0.5">
            You will be logged out on all devices
          </p>
        </div>
        <UButton
          label="Sign Out"
          color="error"
          variant="soft"
          icon="i-heroicons-arrow-right-on-rectangle"
          @click="signOut"
        />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const supabase = useSupabaseClient()
const toast = useToast()

const { data: { session } } = await supabase.auth.getSession()
const user = session?.user

const userEmail = computed(() => user?.email || '')
const displayName = computed(() =>
  user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
)
const userInitials = computed(() =>
  displayName.value.slice(0, 2).toUpperCase()
)

const profileForm = reactive({
  fullName: user?.user_metadata?.full_name || '',
})
const profileLoading = ref(false)
const profileSuccess = ref(false)
const profileError = ref('')

async function saveProfile() {
  profileError.value = ''
  profileSuccess.value = false

  if (!profileForm.fullName.trim()) {
    profileError.value = 'Name cannot be empty.'
    return
  }

  profileLoading.value = true

  const { error } = await supabase.auth.updateUser({
    data: { full_name: profileForm.fullName.trim() },
  })

  profileLoading.value = false

  if (error) { profileError.value = error.message; return }

  profileSuccess.value = true
  toast.add({ title: 'Profile updated', color: 'success' })
  setTimeout(() => { profileSuccess.value = false }, 3000)
}

const emailForm = reactive({ newEmail: '' })
const emailLoading = ref(false)
const emailSuccess = ref(false)
const emailError = ref('')

async function updateEmail() {
  emailError.value = ''
  emailSuccess.value = false

  if (!emailForm.newEmail.trim() || !emailForm.newEmail.includes('@')) {
    emailError.value = 'Please enter a valid email address.'
    return
  }

  if (emailForm.newEmail === userEmail.value) {
    emailError.value = 'This is already your current email.'
    return
  }

  emailLoading.value = true

  const { error } = await supabase.auth.updateUser({
    email: emailForm.newEmail.trim(),
  })

  emailLoading.value = false

  if (error) { emailError.value = error.message; return }

  emailSuccess.value = true
  emailForm.newEmail = ''
}

const passwordForm = reactive({
  newPassword: '',
  confirmPassword: '',
})
const passwordLoading = ref(false)
const passwordSuccess = ref(false)
const passwordError = ref('')

async function updatePassword() {
  passwordError.value = ''
  passwordSuccess.value = false

  if (passwordForm.newPassword.length < 8) {
    passwordError.value = 'Password must be at least 8 characters.'
    return
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordError.value = 'Passwords do not match.'
    return
  }

  passwordLoading.value = true

  const { error } = await supabase.auth.updateUser({
    password: passwordForm.newPassword,
  })

  passwordLoading.value = false

  if (error) { passwordError.value = error.message; return }

  passwordSuccess.value = true
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  toast.add({ title: 'Password updated', color: 'success' })
  setTimeout(() => { passwordSuccess.value = false }, 3000)
}

async function signOut() {
  await supabase.auth.signOut()
  navigateTo('/login')
}
</script>