<script lang="ts">
    //
</script>

<h1>Register</h1>

<form method="post" class="flex flex-col">
    <label>
        <span>Email address</span>
        <input type="email" name="email" />
    </label>

    <label>
        <span>Username</span>
        <input type="text" name="username" />
    </label>

    <label>
        <span>Password</span>
        <input type="password" name="password" />
    </label>

    <label>
        <span>Confirm password</span>
        <input type="password" name="passwordConfirm" />
    </label>

    <button>Register</button>
</form>

<a href="/app/login">I already have an account!</a>
