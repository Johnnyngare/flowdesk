<!-- pages/signup.vue -->
<template>
  <div class="min-h-screen bg-[#060912] flex items-center justify-center p-4">
    <div class="w-full max-w-md">

      <div class="flex items-center justify-center gap-3 mb-8">
        <div class="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
          <span class="text-white font-bold">F</span>
        </div>
        <span class="text-white font-bold text-xl">FlowDesk</span>
      </div>

      <div class="bg-[#0b0f1a] border border-[#1a2035] rounded-2xl p-8">
        <h1 class="text-white text-2xl font-bold mb-1">Create your account</h1>
        <p class="text-gray-500 text-sm mb-6">Start managing your work with FlowDesk</p>

        <div class="space-y-4">
          <div>
            <label class="text-gray-400 text-sm block mb-1.5">Full Name</label>
            <UInput
              v-model="fullName"
              type="text"
              placeholder="Jamie Doe"
              size="lg"
              class="w-full"
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
            />
          </div>

          <div>
            <label class="text-gray-400 text-sm block mb-1.5">Password</label>
            <UInput
              v-model="password"
              type="password"
              placeholder="••••••••"
              size="lg"
              class="w-full"
            />
          </div>

          <UButton
            label="Create account"
            color="primary"
            size="lg"
            class="w-full justify-center mt-2"
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
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const fullName = ref('')
const email = ref('')
const password = ref('')

function handleSignup() {
  console.log('Signup clicked:', email.value)
  navigateTo('/dashboard')
}
</script>