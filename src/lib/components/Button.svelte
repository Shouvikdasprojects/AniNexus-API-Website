<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    export let type = 'primary';
    export let size = 'default';
    export let url = null;
    export let urlTarget = "_self";
    export let title = "";

    export let callback = null;

    function onClick(e) {
        if (!url || url === '#' || url === 'null') {
            e.preventDefault();
        }
        dispatch('message', {text: 'clicked'});

        if (callback instanceof Function) {
            callback(e);
        }
    }
</script>

{#if url && url !== 'null'}
<a href="{url}"
   target={urlTarget}
   title={title || null}
   class="button button--type-{type} button--size-{size}"
   on:click={onClick}
>
    <slot/>
</a>
{:else}
<button type="button"
   title={title || null}
   class="button button--type-{type} button--size-{size}"
   on:click={onClick}
>
    <slot/>
</button>
{/if}

<style lang="scss">
    .button {
      display: inline-flex;
      gap: 8px;
      color: var(--typography-100);
      transition: all 0.25s ease;
      align-items: center;
      justify-content: center;
      border-radius: var(--border-radius-small);
      user-select: none;
      max-width: fit-content;
      cursor: pointer;
      border: none;
      background: transparent;
      font-family: inherit;
      font-size: inherit;
      line-height: inherit;
      text-decoration: none;
      box-sizing: border-box;

      &:active {
        transform: translateY(2px);
      }

        &--size {
          &-default {
            padding: 16px 24px;
          }

          &-small {
            padding: 8px 16px;
            font-size: 12px;
          }

          &-full-width {
            width: 100%;
            max-width: unset;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 16px 24px;
          }
        }

        &--type {
            &-primary {
              background: var(--background-button-primary-default);

              &:hover {
                background: var(--background-button-primary-hover);
              }
            }

            &-secondary-outline {
              border: 1px solid var(--background-300);

              &:hover {
                border: 1px solid var(--background-500);
              }
            }

            &-tertiary {
              text-decoration: underline;

              &:hover {
                background: var(--background-300);
              }
            }

            &-link {
              text-decoration: underline;
              padding: 0;
              margin-left: 8px;
            }

            &-link-heading {
              text-decoration: underline;
              padding: 0;
              margin: 0 0 0 8px;
            }

          &-link-assistive {
            text-decoration: underline;
            padding: 0;
            margin: 0;
            gap: 2px;
          }
        }
    }


    @media screen and (max-width: 1250px) {
      .button {
        &--size {
          &-default {
            padding: 16px 12px;
          }

          &-small {
            padding: 4px 8px;
            font-size: 12px;
          }

          &-full-width {
            padding: 16px 12px;
          }
        }
      }
    }


    @media screen and (max-width: 1000px) {
      .button {
        &--type {
          &-nav-link, &-nav-icon-link {
            display: flex;
            padding: 20px 32px;
            font-size: var(--type-size-heading-3);
            width: 100%;

            &:hover {
              background: rgba(255,255,255,.1);
            }
          }
        }
      }
    }

    @media screen and (max-width: 700px) {
      .button {
        width: 100%;
        max-width: unset;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 14px 20px;

        &--type-link,
        &--type-link-heading,
        &--type-link-assistive {
          display: inline;
          padding: 0 4px;
          margin: 0;
          width: auto;
        }
      }
    }

</style>
