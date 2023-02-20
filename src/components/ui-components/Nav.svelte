<script lang="ts">
  import { logout } from "../../actions/authActions";
  import { userStore } from "../../stores/store";
  import Sun from "svelte-material-icons/WhiteBalanceSunny.svelte";
  import Moon from "svelte-material-icons/MoonWaxingCrescent.svelte";
  import Github from "svelte-material-icons/Github.svelte";
  import ShieldLock from "svelte-material-icons/ShieldLock.svelte";

  type Theme = "light" | "dark";

  let theme: Theme = (localStorage.getItem("theme") as Theme) || "dark";

  const themeHandler = () => {
    if (theme === "dark") {
      theme = "light";
    } else {
      theme = "dark";
    }
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  };
</script>

<nav class="nav-container">
  <div class="logo">
    <div class="heading">
      <span class="icon"><ShieldLock size="3rem" /></span>
      <h1>
        {$userStore.username}
      </h1>
    </div>
  </div>
  <div class="nav-panel">
    <ul>
      <li>
        <a
          class="icon-button icon-link-button"
          target="_blank"
          href="http://www.github.com/smhaley/basic-pass"
          rel="noreferrer"
        >
          <Github size={"1.9em"} />
        </a>
      </li>
      <li>
        <button
          aria-label={`${theme === "dark" ? "light" : "dark"} theme`}
          class="icon-button"
          on:click={themeHandler}
        >
          {#if theme === "dark"}
            <Sun size={"1.5em"} />
          {:else}
            <Moon size={"1.5em"} />
          {/if}
        </button>
      </li>
      <li>
        <button class="primary-button" on:click={logout}> Logout </button>
      </li>
    </ul>
  </div>
</nav>

<style>
  div {
    transition: 0.1s ease-in-out;
  }
  .nav-container {
    height: 70px;
    background-color: var(--bg-secondary);
    top: 0;
    left: 0;
    justify-content: space-between;
    z-index: 100;
    position: fixed;
    width: 100%;
    display: flex;
    align-items: center;
    box-shadow: var(--container-shadow);
    border-bottom: 1px solid var(--green);
  }

  .logo {
    padding-left: 50px;
    flex-shrink: 0;
    transition: 0.1s ease-in-out;
  }

  .nav-panel {
    padding-top: 6px;
    padding-right: 50px;
    flex-shrink: 0;
    transition: 0.1s ease-in-out;
  }

  li {
    display: inline-block;
    padding: 0 1rem;
  }

  .icon-link-button {
    border: none !important;
    color: inherit;
    text-decoration: underline !important;
    cursor: pointer;
  }

  .icon-link-button:visited {
    background: inherit;
  }

  .heading {
    display: flex;
  }
  .icon {
    margin-right: 16px;
    margin-top: 6px;
  }

  @media (max-width: 768px) {
    .logo {
      padding-left: 20px;
    }

    .nav-panel {
      padding-right: 0px;
      padding-left: 0;
    }

    li {
      padding: 0 0.4rem;
    }
  }

  @media (max-width: 480px) {
    .logo {
      padding-left: 5px;
    }

    .nav-panel {
      padding-right: 0px;
      padding-left: 0;
    }

    li {
      padding: 0 0.1rem;
    }
  }
</style>
