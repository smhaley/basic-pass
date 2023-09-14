<script lang="ts">
  export let label: string;
  export let checked: boolean;
  export let handleChange: (settingsKey: string, status: boolean) => void;

  const handleCheck = (event: Event) => {
    const checkbox = event.target as HTMLInputElement;
    checked = checkbox.checked;
    handleChange(label, checked);
  };
</script>

<label>
  <input bind:checked type="checkbox" on:change={handleCheck} />
  <span class="label-content">{label}</span>
</label>

<style>
  input {
    margin: 0;
    -webkit-appearance: none;
    position: relative;
    width: 40px;
    height: 20px;
    border-radius: 25px;
    background-color: var(--font-color);
    transition: background 0.3s;
    outline: none;
    cursor: pointer;
  }
  input::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 30%;
    transform: translate(-50%, -50%);
  }

  input::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 30%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    height: 0.9rem;
    width: 0.9rem;
    background-color: white;
    transition: left 0.3s;
  }

  input::after:focus {
    box-shadow: -1px 0px 45px 69px rgba(0, 0, 0, 1);
  }

  input:checked {
    background-color: var(--light-blue);
  }

  input:checked::after {
    left: 70%;
  }
  input:focus {
    box-shadow: 0px 0px 5px 5px var(--icon-hov-color-primary);
  }
  label {
    display: flex;
    cursor: pointer;
  }
  .label-content {
    padding-left: 20px;
    text-transform: capitalize;
  }
</style>
