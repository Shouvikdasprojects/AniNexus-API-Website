<script>
    import Chip from "./Chip.svelte";

    export let supportsV1 = true;
    export let supportsV3 = false;
    export let supportsV4 = false;
    export let type = 'Wrapper';
    export let author = null;
    export let title = null;
    export let language = null;
    export let url = null;
    import {IconArrowDownLeft} from '@tabler/icons-svelte';
    import Divider from "./Divider.svelte";
</script>


<a href="{url}" target="_blank" rel="noopener noreferrer" class="cardIntegrations">
    <div class="cardIntegrations__metaWrapper">
        <div class="cardIntegrations__meta">
            <div class="cardIntegrations__title">
                <div class="cardIntegrations__languageBlip cardIntegrations__languageBlip--{language}"></div>
                <p>{title}</p>
            </div>

            <div class="cardIntegrations__sub">
                <p>{language}</p>
                <Divider />
                <p class="cardIntegrations__author">By <span>{author}</span></p>
                {#if type}
                    <Divider />
                    <span class="cardIntegrations__typeTag">{type}</span>
                {/if}
            </div>
        </div>

        <span class="icon"><IconArrowDownLeft class="external-link" size={20} stroke={1.5} /></span>
    </div>
    <div class="cardIntegrations__versions">
        {#if supportsV1}
            <Chip type="outline-gradient-light" size="small">v1 (REST)</Chip>
        {/if}
        {#if supportsV3}
            <Chip type="outline" size="small">v3</Chip>
        {/if}
        {#if supportsV4}
            <Chip type="outline" size="small">v4</Chip>
        {/if}
    </div>
</a>

<style lang="scss">
.cardIntegrations {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px;
  gap: 8px;
  width: fit-content;
  min-width: 200px;
  max-width: 250px;
  text-decoration: none;

  background: var(--background-300);
  border: 1px solid var(--background-400);
  border-radius: var(--border-radius-large);
  flex: 1;
  transition: all 0.3s ease;

  &__metaWrapper {
    display: grid;
    grid-template-columns: auto 20px;
    padding: 0;
    gap: 8px;
    width: 100%;

    .icon {
      transition: all 0.3s ease-in-out;
      color: var(--typography-300);
    }
  }

    &__title {
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--typography-100);

        p {
          margin: 0;
          font-size: 0.95rem;
        }
    }

    &__meta {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 0;
        color: var(--typography-300);
        gap: 4px;
    }

    &__sub {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;

        p {
          margin: 0;
          text-transform: capitalize;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 80px;
        }
    }

    &__typeTag {
        font-size: 10px;
        color: #94A3B8;
        background: rgba(255, 255, 255, 0.05);
        padding: 1px 6px;
        border-radius: 4px;
        white-space: nowrap;
    }

    &__author {
        color: var(--typography-200);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 100px;

        span {
          color: #A78BFA;
          font-weight: 500;
        }
    }

    &__languageBlip {
    height: 10px;
    width: 10px;
    border-radius: 100%;
    flex-shrink: 0;

        &--php {
          background: #8A91BD;
        }

        &--javascript {
          background: #F0DB4F;
        }

        &--typescript {
          background: #3178C6;
        }

        &--nodejs {
          background: #8BC500;
        }

        &--dart {
          background: #00B4AB;
        }

        &--go {
          background: #00ADD8;
        }

        &--elixir {
          background: #4e2a8e;
        }

        &--kotlin {
          background: #f85d06;
        }

        &--java {
          background: #ED8B00;
        }

        &--dotnet, &--csharp {
          background: #68217A;
        }

        &--python {
          background: #3776AB;
        }

        &--ruby {
          background: #D22401;
        }

        &--rust {
          background: #DEA584;
        }

        &--swift {
          background: #F05138;
        }
    }

  &:hover {
    background: var(--background-400);
    border: 1px solid rgba(139, 92, 246, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);

    .cardIntegrations__metaWrapper {
      .icon {
        transform: translate(3px, -3px);
        color: #A78BFA;
      }
    }
  }
}

@media screen and (max-width: 700px) {
  .cardIntegrations {
    min-width: unset;
    max-width: unset;
    width: 100%;
    flex-direction: row;
    flex: unset;

    &__versions {
      display: flex;
      gap: 8px;
    }
  }
}
</style>
