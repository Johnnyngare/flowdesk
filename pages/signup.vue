<template>
  <div class="min-h-screen bg-[#060912] flex items-center justify-center p-4">
    <div class="w-full max-w-md">

      <div class="flex items-center justify-center gap-3 mb-8">
        <div class="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
          <span class="text-white font-bold text-lg">F</span>
        </div>
        <span class="text-white font-bold text-xl tracking-tight">FlowDesk</span>
      </div>

      <div class="bg-[#0b0f1a] border border-[#1a2035] rounded-2xl p-8">

        <div v-if="signupSuccess" class="text-center py-4">
          <div class="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 
                      flex items-center justify-center mx-auto mb-4">
            <UIcon name="i-heroicons-envelope" class="w-6 h-6 text-emerald-400" />
          </div>
          <h2 class="text-white font-bold text-lg mb-2">Check your email</h2>
          <p class="text-gray-400 text-sm">
            We sent a confirmation link to<br/>
            <span class="text-white">{{ email }}</span>
          </p>
          <p class="text-gray-600 text-xs mt-3">
            Click the link in the email to activate your account.
          </p>
        </div>

        <div v-else>
          <h1 class="text-white text-2xl font-bold mb-1">Create your account</h1>
          <p class="text-gray-500 text-sm mb-6">
            Start managing your work with FlowDesk
          </p>

          <div
            v-if="errorMessage"
            class="mb-4 p-3 bg-red-500/10 border border-red-500/20 
                   rounded-lg text-red-400 text-sm"
          >
            {{ errorMessage }}
          </div>

          <div class="space-y-4">
            <div>
              <label class="text-gray-400 text-sm block mb-1.5">Full Name</label>
              <UInput
                v-model="fullName"
                type="text"
                placeholder="Jamie Doe"
                size="lg"
                class="w-full"
                :disabled="loading"
              />
            </div>

            <div>
              <label class="text-gray-400 text-sm block mb-1.5">Email</label>
              <UInput
                v-model="email"
                type="email"
                placeholder="you@example.com"
                size="lg"
                class="w-full"
                :disabled="loading"
              />
            </div>

            <div>
              <label class="text-gray-400 text-sm block mb-1.5">Password</label>
              <UInput
                v-model="password"
                type="password"
                placeholder="Min. 8 characters"
                size="lg"
                class="w-full"
                :disabled="loading"
              />
            </div>

            <UButton
              :label="loading ? 'Creating account...' : 'Create account'"
              color="primary"
              size="lg"
              class="w-full justify-center"
              :loading="loading"
              :disabled="loading"
              @click="handleSignup"
            />
          </div>

          <p class="text-center text-gray-500 text-sm mt-6">
            Already have an account?
            <NuxtLink to="/login" class="text-indigo-400 hover:underline">
              Sign in
            </NuxtLink>
          </p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const supabase = useSupabaseClient()

const fullName = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const signupSuccess = ref(false)

async function handleSignup() {
  errorMessage.value = ''

  if (!fullName.value || !email.value || !password.value) {
    errorMessage.value = 'Please fill in all fields.'
    return
  }
  if (password.value.length < 8) {
    errorMessage.value = 'Password must be at least 8 characters.'
    return
  }

  loading.value = true

  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: {
        full_name: fullName.value,
      }
    }
  })

  loading.value = false

  if (error) {
    errorMessage.value = error.message
    return
  }

  signupSuccess.value = true
}
</script>