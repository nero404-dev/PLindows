(() => {
    'use strict';
  
    const COLLECTIONS_KEY = 'personal-library:collections';
    const ENTRIES_KEY = 'personal-library:entries';
    const VIEW_KEY = 'personal-library:view';
  
    const initialCollections = [
      {
        id: 'c-books',
        name: 'Books to return to',
        emoji: '📚',
        parentId: null,
        createdAt: '2026-01-04'
      },
      {
        id: 'c-style',
        name: 'A considered wardrobe',
        emoji: '👕',
        parentId: null,
        createdAt: '2026-01-07'
      },
      {
        id: 'c-places',
        name: 'Places to wander',
        emoji: '🌿',
        parentId: null,
        createdAt: '2026-01-10'
      },
      {
        id: 'c-tops',
        name: 'Top 5 shirts',
        emoji: '👕',
        parentId: 'c-style',
        createdAt: '2026-01-08'
      },
      {
        id: 'c-summer',
        name: 'For late summer',
        emoji: '👕',
        parentId: 'c-tops',
        createdAt: '2026-01-09'
      }
    ];
  
    const initialEntries = [
      {
        id: 'e-1',
        title: 'The Book of Disquiet',
        note: 'A quiet companion for slow mornings.',
        category: 'favorite',
        completed: true,
        collectionId: 'c-books',
        imageUrl: '',
        createdAt: '2026-01-04'
      },
      {
        id: 'e-2',
        title: 'Braiding Sweetgrass',
        note: 'Read the chapter on reciprocity again.',
        category: 'favorite',
        completed: false,
        collectionId: 'c-books',
        imageUrl: '',
        createdAt: '2026-01-04'
      },
      {
        id: 'e-3',
        title: 'Soft white poplin shirt',
        note: 'Look for a relaxed collar and long cuffs.',
        category: 'buy',
        completed: false,
        collectionId: 'c-tops',
        imageUrl: '',
        createdAt: '2026-01-09'
      },
      {
        id: 'e-4',
        title: 'A month in Lisbon',
        note: 'Make room for a slower kind of travel.',
        category: 'dream',
        completed: false,
        collectionId: 'c-places',
        imageUrl: '',
        createdAt: '2026-01-10'
      },
      {
        id: 'e-5',
        title: 'Learn to make fresh pasta',
        note: 'Start with one Sunday afternoon.',
        category: 'goal',
        completed: false,
        collectionId: null,
        imageUrl: '',
        createdAt: '2026-01-11'
      },
      {
        id: 'e-6',
        title: 'Keep a commonplace book',
        note: 'Collect the sentences that stay.',
        category: 'objective',
        completed: false,
        collectionId: null,
        imageUrl: '',
        createdAt: '2026-01-12'
      }
    ];
  
    const categoryLabels = {
      favorite: 'Favorite',
      buy: 'To buy',
      goal: 'Goal',
      objective: 'Objective',
      dream: 'Dream'
    };
  
    const state = {
      collections: normalizeCollections(
        readStorage(COLLECTIONS_KEY, initialCollections)
      ),
  
      entries: normalizeEntries(
        readStorage(ENTRIES_KEY, initialEntries)
      ),
  
      selectedId: null,
      search: '',
      mobileOpen: false,
  
      expanded: new Set(['c-style', 'c-tops']),
  
      modal: null,
      confirmation: null,
      lightbox: null,
  
      viewMode: readStorage(VIEW_KEY, 'list') === 'board'
        ? 'board'
        : 'list'
    };
  
    const iconPaths = {
      book:
        '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>',
  
      chevronDown:
        '<path d="m6 9 6 6 6-6"/>',
  
      chevronRight:
        '<path d="m9 18 6-6-6-6"/>',
  
      check:
        '<path d="m5 12 4 4L19 6"/>',
  
      file:
        '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/>',
  
      folder:
        '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
  
      folderPlus:
        '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M12 11v6M9 14h6"/>',
  
      heart:
        '<path d="M20.8 8.6c0 5.4-8.8 10.2-8.8 10.2S3.2 14 3.2 8.6A4.6 4.6 0 0 1 12 6.1a4.6 4.6 0 0 1 8.8 2.5Z"/>',
  
      lightbulb:
        '<path d="M9 18h6M10 22h4"/><path d="M15.1 14.7A6 6 0 1 0 8.9 14.7c.7.6 1.1 1.3 1.1 2.3h4c0-1 .4-1.7 1.1-2.3Z"/>',
  
      menu:
        '<path d="M4 6h16M4 12h16M4 18h16"/>',
  
      pencil:
        '<path d="m4 16-.7 4.7L8 20l11.7-11.7a2.1 2.1 0 0 0-3-3Z"/><path d="m14.5 6.5 3 3"/>',
  
      plus:
        '<path d="M12 5v14M5 12h14"/>',
  
      search:
        '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  
      shoppingBag:
        '<path d="M6 8h12l1 13H5L6 8Z"/><path d="M9 8a3 3 0 0 1 6 0"/>',
  
      target:
        '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  
      trash:
        '<path d="M4 7h16M10 11v6M14 11v6"/><path d="m6 7 1 14h10l1-14M9 7V4h6v3"/>',
  
      x:
        '<path d="m6 6 12 12M18 6 6 18"/>',
  
      image:
        '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
  
      upload:
        '<path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M5 20h14"/>',
  
      external:
        '<path d="M14 5h5v5"/><path d="m19 5-8 8"/><path d="M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/>'
    };
  
    function icon(name, size = 14, extra = '') {
      return `
        <svg
          class="icon ${extra}"
          width="${size}"
          height="${size}"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          ${iconPaths[name] || ''}
        </svg>
      `;
    }
  
    function readStorage(key, fallback) {
      try {
        const saved = window.localStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallback;
      } catch {
        return fallback;
      }
    }
  
    function persist() {
      try {
        window.localStorage.setItem(
          COLLECTIONS_KEY,
          JSON.stringify(state.collections)
        );
  
        window.localStorage.setItem(
          ENTRIES_KEY,
          JSON.stringify(state.entries)
        );
  
        window.localStorage.setItem(
          VIEW_KEY,
          state.viewMode
        );
      } catch (error) {
        console.warn(
          'Library could not be fully saved to localStorage.',
          error
        );
      }
    }
  
    function normalizeCollections(collections) {
      return collections.map((collection) => ({
        ...collection,
  
        // Existing collections from the old version did not have emoji.
        emoji: collection.emoji || '📁'
      }));
    }
  
    function normalizeEntries(entries) {
      return entries.map((entry) => ({
        ...entry,
  
        // Backward compatibility.
        imageUrl: entry.imageUrl || entry.image || ''
      }));
    }
  
    function makeId(prefix) {
      return `${prefix}-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 7)}`;
    }
  
    function escapeHtml(value) {
      return String(value ?? '').replace(
        /[&<>"']/g,
        (character) => ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#039;'
        }[character])
      );
    }
  
    function safeImageUrl(value) {
      const url = String(value || '').trim();
  
      if (!url) return '';
  
      if (
        url.startsWith('data:image/') ||
        url.startsWith('blob:')
      ) {
        return url;
      }
  
      try {
        const parsed = new URL(url);
  
        if (
          parsed.protocol === 'http:' ||
          parsed.protocol === 'https:'
        ) {
          return parsed.href;
        }
      } catch {
        return '';
      }
  
      return '';
    }
  
    function descendantsOf(collectionId) {
      const ids = new Set();
  
      const visit = (parentId) => {
        state.collections
          .filter(
            (collection) => collection.parentId === parentId
          )
          .forEach((child) => {
            ids.add(child.id);
            visit(child.id);
          });
      };
  
      visit(collectionId);
  
      return ids;
    }
  
    function collectionPathFor(collectionId) {
      const byId = new Map(
        state.collections.map((collection) => [
          collection.id,
          collection
        ])
      );
  
      const path = [];
      const visited = new Set();
  
      let current = byId.get(collectionId);
  
      while (current && !visited.has(current.id)) {
        visited.add(current.id);
        path.unshift(current);
  
        current = current.parentId
          ? byId.get(current.parentId)
          : undefined;
      }
  
      return path;
    }
  
    function getSelectedEntries() {
      return state.selectedId
        ? state.entries.filter(
            (entry) =>
              entry.collectionId === state.selectedId
          )
        : state.entries.filter(
            (entry) => entry.collectionId === null
          );
    }
  
    function getChildren() {
      return state.selectedId
        ? state.collections.filter(
            (collection) =>
              collection.parentId === state.selectedId
          )
        : state.collections.filter(
            (collection) => collection.parentId === null
          );
    }
  
    function getVisibleEntries() {
      const query = state.search.trim().toLowerCase();
  
      if (!query) {
        return getSelectedEntries();
      }
  
      return state.entries.filter((entry) =>
        `${entry.title} ${entry.note} ${
          categoryLabels[entry.category]
        }`
          .toLowerCase()
          .includes(query)
      );
    }
  
    function getVisibleCollections() {
      const query = state.search.trim().toLowerCase();
  
      if (!query) {
        return getChildren();
      }
  
      return state.collections.filter((collection) =>
        collection.name.toLowerCase().includes(query)
      );
    }
  
    function renderTreeNode(collection, depth = 0) {
      const children = state.collections.filter(
        (item) => item.parentId === collection.id
      );
  
      const isExpanded = state.expanded.has(
        collection.id
      );
  
      const count = state.entries.filter(
        (entry) =>
          entry.collectionId === collection.id
      ).length;
  
    //   <div
    //         class="tree-row ${
    //           state.selectedId === collection.id
    //             ? 'selected'
    //             : ''
    //         }"
    //         style="padding-left:${depth * 13}px"
    //       ></div>
      
      return `
        <div>
          <div
            class="tree-row ${
              state.selectedId === collection.id
                ? 'selected'
                : ''
            }"
            style="padding-left:${depth * 13}px"
          >
            <button
              class="tree-toggle"
              data-action="toggle-tree"
              data-id="${collection.id}"
              aria-label="${
                isExpanded ? 'Collapse' : 'Expand'
              } collection"
            >
              ${
                children.length
                  ? icon(
                      isExpanded
                        ? 'chevronDown'
                        : 'chevronRight',
                      13
                    )
                  : '<span class="tree-spacer"></span>'
              }
            </button>
  
            <button
              class="tree-name"
              data-action="open-collection"
              data-id="${collection.id}"
            >
              <span class="tree-emoji">
                ${escapeHtml(collection.emoji)}
              </span>
  
              ${escapeHtml(collection.name)}
            </button>
  
            <span class="tree-count">
              ${count || ''}
            </span>
          </div>
  
          ${
            isExpanded
              ? children
                  .map((child) =>
                    renderTreeNode(child, depth + 1)
                  )
                  .join('')
              : ''
          }
        </div>
      `;
    }
  
    function renderSidebar() {
      const roots = state.collections.filter(
        (collection) => collection.parentId === null
      );
  
      return `
        <aside class="sidebar ${
          state.mobileOpen ? 'open' : ''
        }">
  
          <div class="side-section">
            <span class="side-label">Library</span>
  
            <button
              class="side-action"
              data-action="home"
            >
              ${icon('book', 14, 'small-icon')}
              Overview
            </button>
  
            <button
              class="side-action"
              data-action="new-entry"
            >
              ${icon('plus', 14, 'small-icon')}
              Add an entry
            </button>
  
            <button
              class="side-action"
              data-action="new-collection"
              data-parent=""
            >
              ${icon('folderPlus', 14, 'small-icon')}
              New collection
            </button>
          </div>
  
          <div class="side-section">
            <span class="side-label">
              Collections
            </span>
  
            <div class="collection-tree">
              ${
                roots.length
                  ? roots
                      .map((collection) =>
                        renderTreeNode(collection)
                      )
                      .join('')
                  : '<span class="side-label">No collections yet</span>'
              }
            </div>
          </div>
  
          <p class="sidebar-note">
            Keep the things that make a life feel like yours.
          </p>
          <a class="copyright" href="https://nero404-dev.github.io/nero404-portfolio/">nero404</a>
        </aside>
      `;
    }
  
    function renderSearchBox() {
      return `
        <div class="search-wrap">
          ${icon('search', 14)}
  
          <input
            id="archive-search"
            class="search-input"
            type="search"
            value="${escapeHtml(state.search)}"
            placeholder="Search archive"
            aria-label="Search archive"
          >
        </div>
      `;
    }
  
    function renderTopbar() {
      return `
        <header class="topbar">
          <button
            class="wordmark"
            data-action="home"
            aria-label="Go to library home"
          >
          PLindows
          </button>
  
          <nav class="topbar-nav">
            <button
              class="${!state.selectedId ? 'active' : ''}"
              data-action="home"
            >
              Overview
            </button>
  
            <button data-action="archive">
              Archive
            </button>
          </nav>
  
          <button
            class="mobile-menu"
            data-action="toggle-mobile"
            aria-label="Toggle navigation"
          >
            ${icon(
              state.mobileOpen ? 'x' : 'menu',
              19
            )}
          </button>
        </header>
      `;
    }
  
    function renderViewSwitcher() {
      return `
        <div class="view-switcher">
          <button
            class="${state.viewMode === 'list' ? 'active' : ''}"
            data-action="set-view"
            data-view="list"
          >
            ${icon('file', 12)}
            LIST
          </button>
  
          <button
            class="${state.viewMode === 'board' ? 'active' : ''}"
            data-action="set-view"
            data-view="board"
          >
            ${icon('image', 12)}
            BOARD
          </button>
        </div>
      `;
    }
  
    function renderToolbar(selected, path) {
      if (state.selectedId && !state.search) {
        return `
          <div class="notes-toolbar">
  
            <nav
              class="notes-breadcrumbs"
              aria-label="Breadcrumb"
            >
              <button data-action="home">
                Library
              </button>
  
              ${path
                .map(
                  (collection, index) => `
                    <span class="notes-breadcrumb-segment">
  
                      ${icon('chevronRight', 12)}
  
                      ${
                        index === path.length - 1
                          ? `
                            <span aria-current="page">
                              ${escapeHtml(
                                collection.name
                              )}
                            </span>
                          `
                          : `
                            <button
                              data-action="open-collection"
                              data-id="${collection.id}"
                            >
                              ${escapeHtml(
                                collection.name
                              )}
                            </button>
                          `
                      }
  
                    </span>
                  `
                )
                .join('')}
            </nav>
  
            <div class="notes-toolbar-actions">
  
              ${renderViewSwitcher()}
  
              ${renderSearchBox()}
  
              <button
                class="button"
                data-action="new-collection"
                data-parent="${state.selectedId}"
              >
                ${icon('folderPlus', 14)}
                New page
              </button>
  
              <button
                class="button primary"
                data-action="new-entry"
              >
                ${icon('plus', 14)}
                New note
              </button>
  
            </div>
          </div>
  
          <section class="notes-document-head">
  
            <div class="notes-document-icon">
              ${
                escapeHtml(
                  selected?.emoji || '📁'
                )
              }
            </div>
  
            <h1 class="notes-document-title">
              ${escapeHtml(selected?.name || '')}
            </h1>
  
            <p class="notes-document-meta">
              <span>
                ${getSelectedEntries().length}
                ${
                  getSelectedEntries().length === 1
                    ? 'note'
                    : 'notes'
                }
              </span>
  
              <span class="dot">·</span>
  
              <span>
                ${getChildren().length}
                ${
                  getChildren().length === 1
                    ? 'subpage'
                    : 'subpages'
                }
              </span>
            </p>
  
          </section>
        `;
      }
  
      return `
        <div class="content-toolbar">
  
          <div class="toolbar-left">
  
            <div>
              ${
                state.selectedId
                  ? `
                    <div class="breadcrumb">
                      <button data-action="home">
                        Library
                      </button>
  
                      ${icon('chevronRight', 11)}
  
                      ${escapeHtml(
                        selected?.name || ''
                      )}
                    </div>
                  `
                  : ''
              }
  
              <h2 class="section-heading">
                ${
                  state.search
                    ? 'Search results'
                    : selected?.name ||
                      'Your collections'
                }
              </h2>
            </div>
          </div>
  
          <div class="toolbar-actions">
            ${renderSearchBox()}
  
            <button
              class="button primary"
              data-action="new-entry"
            >
              ${icon('plus', 14)}
              <span>Entry</span>
            </button>
          </div>
  
        </div>
      `;
    }
  
    function renderCollectionCards(collections) {
      if (!collections.length) {
        return '';
      }
  
      return `
        <section
          class="collection-grid"
          aria-label="Collections"
        >
  
          ${collections
            .map((collection) => {
              const itemCount =
                state.entries.filter(
                  (entry) =>
                    entry.collectionId ===
                    collection.id
                ).length;
  
              const childCount =
                state.collections.filter(
                  (item) =>
                    item.parentId === collection.id
                ).length;
  
              const accent =
                collection.name.length % 2
                  ? 'var(--sage)'
                  : 'var(--terracotta)';
  
              return `
                <article
                  class="collection-card"
                  data-action="open-collection"
                  data-id="${collection.id}"
                  style="--card-accent:${accent}"
                >
  
                  <div class="collection-card-emoji">
                    ${escapeHtml(collection.emoji)}
                  </div>
  
                  <div class="card-top">
  
                    <h3>
                      ${escapeHtml(
                        collection.name
                      )}
                    </h3>
  
                    <div class="card-menu-group">
  
                      <button
                        class="icon-button"
                        data-action="edit-collection"
                        data-id="${collection.id}"
                        aria-label="Rename ${escapeHtml(
                          collection.name
                        )}"
                      >
                        ${icon('pencil', 14)}
                      </button>
  
                      <button
                        class="icon-button delete"
                        data-action="delete-collection"
                        data-id="${collection.id}"
                        aria-label="Delete ${escapeHtml(
                          collection.name
                        )}"
                      >
                        ${icon('trash', 14)}
                      </button>
  
                    </div>
                  </div>
  
                  <p class="card-note">
                    ${
                      childCount
                        ? `${childCount} nested ${
                            childCount === 1
                              ? 'collection'
                              : 'collections'
                          }`
                        : 'A small corner of the archive'
                    }
                  </p>
  
                  <div class="card-bottom">
  
                    <span class="count">
                      ${itemCount}
                      ${
                        itemCount === 1
                          ? 'entry'
                          : 'entries'
                      }
                    </span>
  
                    ${icon('chevronRight', 14)}
  
                  </div>
  
                </article>
              `;
            })
            .join('')}
  
        </section>
      `;
    }
  
    function renderSubpages(children) {
      if (!state.selectedId || state.search) {
        return '';
      }
  
      return `
        <section
          class="notes-section notes-pages-section"
          aria-label="Subpages"
        >
  
          <div class="notes-section-heading">
  
            <div>
              <span class="notes-section-title">
                Subpages
              </span>
  
              <span class="notes-section-count">
                ${children.length}
              </span>
            </div>
  
            <button
              class="notes-add"
              data-action="new-collection"
              data-parent="${state.selectedId}"
              aria-label="Add subpage"
            >
              ${icon('plus', 15)}
            </button>
  
          </div>
  
          ${
            children.length
              ? `
                <div class="notes-page-list">
  
                  ${children
                    .map((collection) => {
                      const pageCount =
                        state.collections.filter(
                          (item) =>
                            item.parentId ===
                            collection.id
                        ).length;
  
                      const entryCount =
                        state.entries.filter(
                          (entry) =>
                            entry.collectionId ===
                            collection.id
                        ).length;
  
                      return `
                        <div class="notes-page-row">
  
                          <button
                            class="notes-page-open"
                            data-action="open-collection"
                            data-id="${collection.id}"
                          >
  
                            <span class="notes-page-emoji">
                              ${escapeHtml(
                                collection.emoji
                              )}
                            </span>
  
                            <span class="notes-page-name">
                              ${escapeHtml(
                                collection.name
                              )}
                            </span>
  
                            <span class="notes-page-count">
                              ${pageCount}
                              ${
                                pageCount === 1
                                  ? 'subpage'
                                  : 'subpages'
                              }
                              ·
                              ${entryCount}
                              ${
                                entryCount === 1
                                  ? 'note'
                                  : 'notes'
                              }
                            </span>
  
                            ${icon(
                              'chevronRight',
                              14
                            )}
  
                          </button>
  
                          <div class="notes-page-actions">
  
                            <button
                              class="icon-button"
                              data-action="edit-collection"
                              data-id="${collection.id}"
                              aria-label="Rename ${escapeHtml(
                                collection.name
                              )}"
                            >
                              ${icon('pencil', 13)}
                            </button>
  
                            <button
                              class="icon-button delete"
                              data-action="delete-collection"
                              data-id="${collection.id}"
                              aria-label="Delete ${escapeHtml(
                                collection.name
                              )}"
                            >
                              ${icon('trash', 13)}
                            </button>
  
                          </div>
  
                        </div>
                      `;
                    })
                    .join('')}
  
                </div>
              `
              : `
                <button
                  class="notes-empty-page"
                  data-action="new-collection"
                  data-parent="${state.selectedId}"
                >
                  ${icon('plus', 14)}
                  Create a subpage
                </button>
              `
          }
  
        </section>
      `;
    }
  
    function renderEntry(entry, notePage) {
      const categoryIcon = {
        favorite: 'heart',
        buy: 'shoppingBag',
        goal: 'target',
        objective: 'book',
        dream: 'lightbulb'
      }[entry.category];
  
      const image = safeImageUrl(
        entry.imageUrl
      );
  
      return `
        <div
          class="entry-row ${
            notePage ? 'notes-entry-row' : ''
          }"
        >
  
          <button
            class="check ${
              entry.completed ? 'done' : ''
            }"
            data-action="toggle-entry"
            data-id="${entry.id}"
            aria-label="${
              entry.completed
                ? 'Mark incomplete'
                : 'Mark complete'
            }"
          >
            ${
              entry.completed
                ? icon('check', 11)
                : ''
            }
          </button>
  
          ${
            image
              ? `
                <button
                  class="entry-thumb"
                  data-action="open-image"
                  data-id="${entry.id}"
                  aria-label="Open image for ${escapeHtml(
                    entry.title
                  )}"
                >
                  <img
                    src="${escapeHtml(image)}"
                    alt=""
                    loading="lazy"
                  >
                </button>
              `
              : ''
          }
  
          <div class="entry-copy ${
            image ? 'has-image' : ''
          }">
  
            <div
              class="entry-title ${
                entry.completed
                  ? 'completed'
                  : ''
              }"
            >
              ${escapeHtml(entry.title)}
            </div>
  
            ${
              entry.note
                ? `
                  <div class="entry-meta">
                    ${escapeHtml(entry.note)}
                  </div>
                `
                : ''
            }
  
          </div>
  
          <div class="entry-type">
            ${icon(categoryIcon, 12)}
            ${escapeHtml(
              categoryLabels[entry.category]
            )}
          </div>
  
          <div class="entry-actions">
  
            <button
              class="icon-button"
              data-action="edit-entry"
              data-id="${entry.id}"
              aria-label="Edit ${escapeHtml(
                entry.title
              )}"
            >
              ${icon('pencil', 13)}
            </button>
  
            <button
              class="icon-button delete"
              data-action="delete-entry"
              data-id="${entry.id}"
              aria-label="Delete ${escapeHtml(
                entry.title
              )}"
            >
              ${icon('trash', 13)}
            </button>
  
          </div>
  
        </div>
      `;
    }
  
    function renderVisualBoard(entries) {
      const imageEntries = entries.filter(
        (entry) => safeImageUrl(entry.imageUrl)
      );
  
      return `
        <section class="visual-board">
  
          <div class="notes-section-heading">
  
            <div>
              <span class="notes-section-title">
                Visual Board
              </span>
  
              <span class="notes-section-count">
                ${imageEntries.length}
              </span>
            </div>
  
            <button
              class="notes-add"
              data-action="new-entry"
              aria-label="Add visual entry"
            >
              ${icon('plus', 15)}
            </button>
  
          </div>
  
          ${
            imageEntries.length
              ? `
                <div class="visual-board-grid">
  
                  ${imageEntries
                    .map((entry) => {
                      const image =
                        safeImageUrl(
                          entry.imageUrl
                        );
  
                      return `
                        <article
                          class="visual-card"
                          data-action="open-image"
                          data-id="${entry.id}"
                        >
  
                          <div class="visual-card-image">
  
                            <img
                              src="${escapeHtml(image)}"
                              alt="${escapeHtml(
                                entry.title
                              )}"
                              loading="lazy"
                            >
  
                            <div
                              class="visual-card-actions"
                            >
  
                              <button
                                class="icon-button"
                                data-action="edit-entry"
                                data-id="${entry.id}"
                                aria-label="Edit ${escapeHtml(
                                  entry.title
                                )}"
                              >
                                ${icon(
                                  'pencil',
                                  13
                                )}
                              </button>
  
                              <button
                                class="icon-button delete"
                                data-action="delete-entry"
                                data-id="${entry.id}"
                                aria-label="Delete ${escapeHtml(
                                  entry.title
                                )}"
                              >
                                ${icon(
                                  'trash',
                                  13
                                )}
                              </button>
  
                            </div>
  
                          </div>
  
                          <div class="visual-card-info">
  
                            <h3>
                              ${escapeHtml(
                                entry.title
                              )}
                            </h3>
  
                            <span>
                              ${icon(
                                {
                                  favorite: 'heart',
                                  buy: 'shoppingBag',
                                  goal: 'target',
                                  objective: 'book',
                                  dream: 'lightbulb'
                                }[entry.category],
                                11
                              )}
  
                              ${escapeHtml(
                                categoryLabels[
                                  entry.category
                                ]
                              )}
                            </span>
  
                          </div>
  
                        </article>
                      `;
                    })
                    .join('')}
  
                </div>
              `
              : `
                <div class="visual-empty">
                  ${icon('image', 20)}
  
                  <h3>
                    Nothing visual here yet
                  </h3>
  
                  <p>
                    Add a photo to an entry and it
                    will appear on this board.
                  </p>
  
                  <button
                    class="button"
                    data-action="new-entry"
                  >
                    ${icon('plus', 14)}
                    Add a visual entry
                  </button>
                </div>
              `
          }
  
        </section>
      `;
    }
  
    function renderEntries(visibleEntries) {
      const notePage =
        Boolean(state.selectedId && !state.search);
  
      const count = state.search
        ? visibleEntries.length
        : getSelectedEntries().length;
  
      const heading = state.search
        ? 'Entries'
        : state.selectedId
        ? 'Notes'
        : 'Loose pages';
  
      if (
        notePage &&
        state.viewMode === 'board'
      ) {
        const nonImageEntries =
          visibleEntries.filter(
            (entry) =>
              !safeImageUrl(entry.imageUrl)
          );
  
        return `
          ${renderVisualBoard(visibleEntries)}
  
          ${
            nonImageEntries.length
              ? `
                <section
                  class="entries-section board-notes-section"
                >
  
                  <div class="entries-heading">
                    <h2>Notes</h2>
  
                    <span class="count">
                      ${nonImageEntries.length}
                      ${
                        nonImageEntries.length === 1
                          ? 'entry'
                          : 'entries'
                      }
                    </span>
                  </div>
  
                  <div class="entries-list">
                    ${nonImageEntries
                      .map((entry) =>
                        renderEntry(entry, false)
                      )
                      .join('')}
                  </div>
  
                </section>
              `
              : ''
          }
        `;
      }
  
      return `
        <section
          class="entries-section ${
            notePage
              ? 'notes-entries-section'
              : ''
          }"
          id="all-entries"
        >
  
          ${
            notePage
              ? `
                <div class="notes-section-heading">
  
                  <div>
                    <span class="notes-section-title">
                      Notes
                    </span>
  
                    <span class="notes-section-count">
                      ${count}
                    </span>
                  </div>
  
                  <button
                    class="notes-add"
                    data-action="new-entry"
                    aria-label="Add note"
                  >
                    ${icon('plus', 15)}
                  </button>
  
                </div>
              `
              : `
                <div class="entries-heading">
  
                  <h2>${heading}</h2>
  
                  <span class="count">
                    ${count}
                    ${
                      count === 1
                        ? 'entry'
                        : 'entries'
                    }
                  </span>
  
                </div>
              `
          }
  
          ${
            visibleEntries.length
              ? `
                <div
                  class="entries-list ${
                    notePage
                      ? 'notes-entry-list'
                      : ''
                  }"
                >
                  ${visibleEntries
                    .map((entry) =>
                      renderEntry(
                        entry,
                        notePage
                      )
                    )
                    .join('')}
                </div>
              `
              : `
                <div
                  class="empty-state ${
                    notePage
                      ? 'notes-empty-state'
                      : ''
                  }"
                >
  
                  ${icon(
                    'book',
                    20,
                    'empty-icon'
                  )}
  
                  <h3>
                    ${
                      state.search
                        ? 'Nothing found'
                        : state.selectedId
                        ? 'No notes here yet'
                        : 'Start keeping things'
                    }
                  </h3>
  
                  <p>
                    ${
                      state.search
                        ? 'Try a different word or search by category.'
                        : 'Add a note for anything you want to remember.'
                    }
                  </p>
  
                  ${
                    !state.search
                      ? `
                        <button
                          class="button"
                          data-action="new-entry"
                        >
                          ${icon('plus', 14)}
                          Add your first note
                        </button>
                      `
                      : ''
                  }
  
                </div>
              `
          }
  
        </section>
      `;
    }
  
    function renderModal() {
      if (state.modal?.type === 'collection') {
        const collection =
          state.collections.find(
            (item) =>
              item.id === state.modal.id
          );
  
        const parent =
          state.collections.find(
            (item) =>
              item.id === state.modal.parentId
          );
  
        const inheritedEmoji =
          parent?.emoji ||
          collection?.emoji ||
          '📁';
  
        return `
          <div
            class="overlay"
            data-action="close-modal"
          >
  
            <div
              class="modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="collection-modal-title"
            >
  
              <p class="modal-kicker">
                ${
                  collection
                    ? 'Edit collection'
                    : 'New collection'
                }
              </p>
  
              <h2 id="collection-modal-title">
                ${
                  collection
                    ? 'Rename this place'
                    : 'Make room for something'
                }
              </h2>
  
              <form data-form="collection">
  
                <div class="form-field">
                  <label for="collection-name">
                    Collection name
                  </label>
  
                  <input
                    id="collection-name"
                    name="name"
                    value="${escapeHtml(
                      state.modal.name || ''
                    )}"
                    placeholder="e.g. Films for rainy days"
                    required
                  >
                </div>
  
                <div class="form-field">
  
                  <label for="collection-emoji">
                    Header emoji
                  </label>
  
                  <div class="emoji-input-wrap">
  
                    <input
                      id="collection-emoji"
                      name="emoji"
                      value="${escapeHtml(
                        state.modal.emoji ??
                        inheritedEmoji
                      )}"
                      maxlength="8"
                      placeholder="e.g. 🚗"
                      autocomplete="off"
                    >
  
                    ${
                      !collection &&
                      parent
                        ? `
                          <span class="emoji-hint">
                            Inherited from
                            ${escapeHtml(
                              parent.name
                            )}
                          </span>
                        `
                        : ''
                    }
  
                  </div>
  
                </div>
  
                <div class="modal-actions">
  
                  <button
                    type="button"
                    class="button quiet"
                    data-action="close-modal"
                  >
                    Cancel
                  </button>
  
                  <button
                    type="submit"
                    class="button primary"
                  >
                    ${
                      collection
                        ? 'Save changes'
                        : 'Create collection'
                    }
                  </button>
  
                </div>
  
              </form>
  
            </div>
          </div>
        `;
      }
  
      if (state.modal?.type === 'entry') {
        const entry =
          state.entries.find(
            (item) =>
              item.id === state.modal.id
          );
  
        const form =
          state.modal.form || {
            title: entry?.title || '',
            note: entry?.note || '',
            category:
              entry?.category || 'favorite',
            collectionId:
              entry?.collectionId ||
              state.selectedId ||
              '',
            imageUrl:
              entry?.imageUrl || ''
          };
  
        const imagePreview =
          safeImageUrl(form.imageUrl);
  
        return `
          <div
            class="overlay"
            data-action="close-modal"
          >
  
            <div
              class="modal entry-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="entry-modal-title"
            >
  
              <p class="modal-kicker">
                ${
                  entry
                    ? 'Edit entry'
                    : 'New entry'
                }
              </p>
  
              <h2 id="entry-modal-title">
                ${
                  entry
                    ? 'Tend to this page'
                    : 'Keep something close'
                }
              </h2>
  
              <form data-form="entry">
  
                <div class="form-field">
  
                  <label for="entry-title">
                    Title
                  </label>
  
                  <input
                    id="entry-title"
                    name="title"
                    value="${escapeHtml(
                      form.title
                    )}"
                    placeholder="What do you want to remember?"
                    required
                  >
  
                </div>
  
                <div class="form-field">
  
                  <label for="entry-note">
                    A little context
                    <span>(optional)</span>
                  </label>
  
                  <textarea
                    id="entry-note"
                    name="note"
                    placeholder="A note to your future self..."
                  >${escapeHtml(
                    form.note
                  )}</textarea>
  
                </div>
  
                <div class="form-field">
  
                  <label>
                    Photo
                    <span>(optional)</span>
                  </label>
  
                  <label
                    class="image-upload"
                    for="entry-image-file"
                  >
  
                    <input
                      id="entry-image-file"
                      name="imageFile"
                      type="file"
                      accept="image/*"
                    >
  
                    <span class="image-upload-icon">
                      ${icon('upload', 18)}
                    </span>
  
                    <strong>
                      ${
                        imagePreview
                          ? 'Replace photo'
                          : 'Add a photo'
                      }
                    </strong>
  
                    <small>
                      JPG, PNG, WEBP or GIF
                    </small>
  
                  </label>
  
                  <div
                    id="image-file-name"
                    class="image-file-name"
                  ></div>
  
                </div>
  
                <div class="form-field">
  
                  <label for="entry-image-url">
                    Or use an image URL
                  </label>
  
                  <div class="url-input-wrap">
  
                    <input
                      id="entry-image-url"
                      name="imageUrl"
                      type="url"
                      value="${escapeHtml(
                        form.imageUrl
                      )}"
                      placeholder="https://example.com/image.jpg"
                    >
  
                    ${icon(
                      'external',
                      13
                    )}
  
                  </div>
  
                  <small class="field-help">
                    Use a direct image link; the
                    image stays hosted at its source.
                  </small>
  
                </div>
  
                ${
                  imagePreview
                    ? `
                      <div class="form-image-preview">
                        <img
                          src="${escapeHtml(
                            imagePreview
                          )}"
                          alt="Current entry image"
                        >
                      </div>
                    `
                    : ''
                }
  
                <div class="form-field">
  
                  <label for="entry-category">
                    This is a
                  </label>
  
                  <select
                    id="entry-category"
                    name="category"
                  >
                    ${Object.entries(
                      categoryLabels
                    )
                      .map(
                        ([value, label]) => `
                          <option
                            value="${value}"
                            ${
                              form.category ===
                              value
                                ? 'selected'
                                : ''
                            }
                          >
                            ${label}
                          </option>
                        `
                      )
                      .join('')}
                  </select>
  
                </div>
  
                <div class="form-field">
  
                  <label for="entry-collection">
                    Keep it in
                  </label>
  
                  <select
                    id="entry-collection"
                    name="collectionId"
                  >
  
                    <option value="">
                      Loose pages
                    </option>
  
                    ${state.collections
                      .map(
                        (collection) => `
                          <option
                            value="${collection.id}"
                            ${
                              form.collectionId ===
                              collection.id
                                ? 'selected'
                                : ''
                            }
                          >
                            ${
                              collection.emoji
                                ? collection.emoji +
                                  ' '
                                : ''
                            }${escapeHtml(
                              collection.name
                            )}
                          </option>
                        `
                      )
                      .join('')}
  
                  </select>
  
                </div>
  
                <div class="modal-actions">
  
                  <button
                    type="button"
                    class="button quiet"
                    data-action="close-modal"
                  >
                    Cancel
                  </button>
  
                  <button
                    type="submit"
                    class="button primary"
                  >
                    ${
                      entry
                        ? 'Save changes'
                        : 'Keep entry'
                    }
                  </button>
  
                </div>
  
              </form>
  
            </div>
          </div>
        `;
      }
  
      if (state.confirmation) {
        const confirmation =
          state.confirmation;
  
        const collection =
          confirmation.type ===
          'collection';
  
        return `
          <div
            class="overlay"
            data-action="close-confirmation"
          >
  
            <div
              class="modal"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="confirm-title"
            >
  
              <p class="modal-kicker">
                Are you sure
              </p>
  
              <h2 id="confirm-title">
                ${
                  collection
                    ? 'Remove this collection?'
                    : 'Remove this entry?'
                }
              </h2>
  
              <p class="confirm-copy">
                ${
                  collection
                    ? `
                      This will remove
                      <strong>
                        ${
                          confirmation.childCount
                        }
                        nested
                        ${
                          confirmation.childCount ===
                          1
                            ? 'collection'
                            : 'collections'
                        }
                      </strong>
                      and
                      <strong>
                        ${
                          confirmation.entryCount
                        }
                        ${
                          confirmation.entryCount ===
                          1
                            ? 'entry'
                            : 'entries'
                        }
                      </strong>.
                      This cannot be undone.
                    `
                    : `
                      This page will be removed
                      from your library. This cannot
                      be undone.
                    `
                }
              </p>
  
              <div class="modal-actions">
  
                <button
                  class="button quiet"
                  data-action="close-confirmation"
                >
                  Keep it
                </button>
  
                <button
                  class="button danger"
                  data-action="confirm-delete"
                >
                  ${icon('trash', 14)}
                  Remove
                </button>
  
              </div>
  
            </div>
  
          </div>
        `;
      }
  
      if (state.lightbox) {
        const entry =
          state.entries.find(
            (item) =>
              item.id === state.lightbox.id
          );
  
        if (!entry) {
          return '';
        }
  
        const image =
          safeImageUrl(entry.imageUrl);
  
        if (!image) {
          return '';
        }
  
        return `
          <div
            class="lightbox"
            data-action="close-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
          >
  
            <button
              class="lightbox-close"
              data-action="close-lightbox"
              aria-label="Close image"
            >
              ${icon('x', 20)}
            </button>
  
            <div
              class="lightbox-content"
              data-action="lightbox-content"
            >
  
              <div class="lightbox-image-wrap">
                <img
                  src="${escapeHtml(image)}"
                  alt="${escapeHtml(
                    entry.title
                  )}"
                >
              </div>
  
              <div class="lightbox-caption">
  
                <div>
                  <h2>
                    ${escapeHtml(
                      entry.title
                    )}
                  </h2>
  
                  ${
                    entry.note
                      ? `
                        <p>
                          ${escapeHtml(
                            entry.note
                          )}
                        </p>
                      `
                      : ''
                  }
                </div>
  
                <span>
                  ${icon(
                    {
                      favorite: 'heart',
                      buy: 'shoppingBag',
                      goal: 'target',
                      objective: 'book',
                      dream: 'lightbulb'
                    }[entry.category],
                    12
                  )}
  
                  ${escapeHtml(
                    categoryLabels[
                      entry.category
                    ]
                  )}
                </span>
  
              </div>
  
            </div>
          </div>
        `;
      }
  
      return '';
    }
  
    function render() {
      const selected =
        state.collections.find(
          (collection) =>
            collection.id ===
            state.selectedId
        );
  
      const path = state.selectedId
        ? collectionPathFor(
            state.selectedId
          )
        : [];
  
      const visibleEntries =
        getVisibleEntries();
  
      const visibleCollections =
        getVisibleCollections();
  
      const children = getChildren();
  
      const totalDone =
        state.entries.filter(
          (entry) => entry.completed
        ).length;
  
      document.querySelector('#app').innerHTML = `
        <div class="app-shell">
  
          ${renderTopbar()}
  
          <div class="workspace">
  
            ${renderSidebar()}
  
            <main class="main">
  
              <div class="main-inner">
  
                ${
                  !state.selectedId &&
                  !state.search
                    ? `
                      <section class="hero">
  
                        <div class="hero-copy">
  
                          <p class="eyebrow">
                            A personal archive
                          </p>
  
                          <h1>
                            Welcome to<br>
                            <em>your library.</em>
                          </h1>
  
                          <p class="hero-subtitle">
                            A gentle place for the
                            books, ideas, plans, and
                            small future selves you
                            want to remember.
                          </p>
  
                        </div>
  
                        <div class="hero-aside">
  
                          <span class="big-count">
                            ${state.entries.length}
                          </span>
  
                          <span class="count-caption">
                            things kept
                          </span>
  
                        </div>
  
                      </section>
                    `
                    : ''
                }
  
                ${renderToolbar(
                  selected,
                  path
                )}
  
                ${
                  state.search
                    ? `
                      <p class="search-result-note">
                        ${
                          visibleCollections.length +
                          visibleEntries.length
                        }
                        results across your archive
                      </p>
                    `
                    : ''
                }
  
                ${renderSubpages(children)}
  
                ${
                  (!state.selectedId ||
                    state.search)
                    ? renderCollectionCards(
                        visibleCollections
                      )
                    : ''
                }
  
                ${renderEntries(
                  visibleEntries
                )}
  
                ${
                  !state.selectedId &&
                  !state.search
                    ? `
                      <div class="archive-footer">
                        <span class="mono">
                          ${totalDone} completed ·
                          ${
                            state.collections.length
                          }
                          collections
                        </span>
                      </div>
                    `
                    : ''
                }
  
              </div>
            </main>
          </div>
  
          ${renderModal()}
  
        </div>
      `;
  
      const autofocus =
        document.querySelector(
          '[autofocus]'
        );
  
      if (autofocus) {
        autofocus.focus();
      }
    }
  
    function goHome() {
      state.selectedId = null;
      state.search = '';
      state.mobileOpen = false;
      state.lightbox = null;
  
      render();
    }
  
    function openCollection(id) {
      state.selectedId = id;
      state.search = '';
      state.mobileOpen = false;
      state.lightbox = null;
  
      render();
    }
  
    function openCollectionModal(
      id = null,
      parentId = state.selectedId
    ) {
      const collection = id
        ? state.collections.find(
            (item) => item.id === id
          )
        : null;
  
      const parent = parentId
        ? state.collections.find(
            (item) =>
              item.id === parentId
          )
        : null;
  
      state.modal = {
        type: 'collection',
        id,
        parentId,
        name:
          collection?.name || '',
        emoji:
          collection?.emoji ||
          parent?.emoji ||
          '📁'
      };
  
      render();
    }
  
    function openEntryModal(id = null) {
      const entry = id
        ? state.entries.find(
            (item) => item.id === id
          )
        : null;
  
      state.modal = {
        type: 'entry',
        id,
  
        form: {
          title:
            entry?.title || '',
  
          note:
            entry?.note || '',
  
          category:
            entry?.category ||
            'favorite',
  
          collectionId:
            entry?.collectionId ||
            state.selectedId ||
            '',
  
          imageUrl:
            entry?.imageUrl || ''
        }
      };
  
      render();
    }
  
    function requestDeleteCollection(id) {
      const childIds =
        descendantsOf(id);
  
      const entryCount =
        state.entries.filter(
          (entry) =>
            entry.collectionId === id ||
            (
              entry.collectionId &&
              childIds.has(
                entry.collectionId
              )
            )
        ).length;
  
      state.confirmation = {
        type: 'collection',
        id,
        childCount: childIds.size,
        entryCount
      };
  
      render();
    }
  
    function requestDeleteEntry(id) {
      state.confirmation = {
        type: 'entry',
        id
      };
  
      render();
    }
  
    function confirmDelete() {
      if (!state.confirmation) {
        return;
      }
  
      if (
        state.confirmation.type ===
        'entry'
      ) {
        state.entries =
          state.entries.filter(
            (entry) =>
              entry.id !==
              state.confirmation.id
          );
      } else {
        const removed = new Set([
          state.confirmation.id,
          ...descendantsOf(
            state.confirmation.id
          )
        ]);
  
        state.collections =
          state.collections.filter(
            (collection) =>
              !removed.has(
                collection.id
              )
          );
  
        state.entries =
          state.entries.filter(
            (entry) =>
              !entry.collectionId ||
              !removed.has(
                entry.collectionId
              )
          );
  
        if (
          state.selectedId &&
          removed.has(
            state.selectedId
          )
        ) {
          state.selectedId = null;
        }
      }
  
      state.confirmation = null;
  
      persist();
      render();
    }
  
    function saveCollection(form) {
      const name =
        String(form.get('name') || '')
          .trim();
  
      if (
        !name ||
        !state.modal ||
        state.modal.type !==
          'collection'
      ) {
        return;
      }
  
      let emoji =
        String(form.get('emoji') || '')
          .trim();
  
      if (!emoji) {
        emoji =
          state.modal.emoji ||
          '📁';
      }
  
      if (state.modal.id) {
        state.collections =
          state.collections.map(
            (item) =>
              item.id ===
              state.modal.id
                ? {
                    ...item,
                    name,
                    emoji
                  }
                : item
          );
      } else {
        const parent =
          state.collections.find(
            (item) =>
              item.id ===
              state.modal.parentId
          );
  
        /*
         * New child collections inherit the
         * parent's emoji.
         *
         * If this is a root collection,
         * use the emoji entered in the modal.
         */
        if (parent) {
          emoji = parent.emoji || emoji;
        }
  
        const newCollection = {
          id: makeId('collection'),
          name,
          emoji,
          parentId:
            state.modal.parentId ||
            null,
          createdAt:
            new Date().toISOString()
        };
  
        state.collections = [
          ...state.collections,
          newCollection
        ];
  
        if (newCollection.parentId) {
          state.expanded.add(
            newCollection.parentId
          );
        }
      }
  
      state.modal = null;
  
      persist();
      render();
    }
  
    function readImageFile(file) {
      return new Promise(
        (resolve, reject) => {
          if (!file) {
            resolve('');
            return;
          }
  
          if (
            !file.type.startsWith(
              'image/'
            )
          ) {
            reject(
              new Error(
                'Please select an image file.'
              )
            );
            return;
          }
  
          const reader =
            new FileReader();
  
          reader.onload = () => {
            const source =
              reader.result;
  
            const image =
              new Image();
  
            image.onload = () => {
              /*
               * Keep localStorage usage
               * under control by resizing
               * uploaded images.
               */
              const maxSize = 1400;
  
              let width =
                image.naturalWidth;
  
              let height =
                image.naturalHeight;
  
              if (
                width > maxSize ||
                height > maxSize
              ) {
                const ratio =
                  Math.min(
                    maxSize / width,
                    maxSize / height
                  );
  
                width =
                  Math.round(
                    width * ratio
                  );
  
                height =
                  Math.round(
                    height * ratio
                  );
              }
  
              const canvas =
                document.createElement(
                  'canvas'
                );
  
              canvas.width = width;
              canvas.height = height;
  
              const context =
                canvas.getContext(
                  '2d'
                );
  
              context.drawImage(
                image,
                0,
                0,
                width,
                height
              );
  
              resolve(
                canvas.toDataURL(
                  'image/jpeg',
                  0.82
                )
              );
            };
  
            image.onerror = () => {
              /*
               * If the browser cannot
               * decode the image, fall
               * back to the original
               * Data URL.
               */
              resolve(source);
            };
  
            image.src = source;
          };
  
          reader.onerror = () => {
            reject(
              new Error(
                'Could not read the image.'
              )
            );
          };
  
          reader.readAsDataURL(file);
        }
      );
    }
  
    async function saveEntry(form) {
      const title =
        String(form.get('title') || '')
          .trim();
  
      if (
        !title ||
        !state.modal ||
        state.modal.type !==
          'entry'
      ) {
        return;
      }
  
      const file =
        form.get('imageFile');
  
      const suppliedUrl =
        String(
          form.get('imageUrl') || ''
        ).trim();
  
      let imageUrl =
        safeImageUrl(suppliedUrl);
  
      /*
       * If the user selected a file,
       * it takes priority over the URL.
       */
      if (
        file &&
        file instanceof File &&
        file.size > 0
      ) {
        try {
          imageUrl =
            await readImageFile(file);
        } catch (error) {
          alert(
            error.message ||
              'Could not read the image.'
          );
          return;
        }
      }
  
      const normalized = {
        title,
  
        note:
          String(
            form.get('note') || ''
          ).trim(),
  
        category:
          form.get('category'),
  
        collectionId:
          form.get('collectionId') ||
          null,
  
        imageUrl
      };
  
      if (state.modal.id) {
        state.entries =
          state.entries.map(
            (entry) =>
              entry.id ===
              state.modal.id
                ? {
                    ...entry,
                    ...normalized
                  }
                : entry
          );
      } else {
        state.entries = [
          ...state.entries,
  
          {
            ...normalized,
            id: makeId('entry'),
            completed: false,
            createdAt:
              new Date().toISOString()
          }
        ];
      }
  
      state.modal = null;
  
      persist();
      render();
    }
  
    document.addEventListener(
      'click',
      (event) => {
        const target =
          event.target.closest(
            '[data-action]'
          );
  
        if (!target) {
          return;
        }
  
        const action =
          target.dataset.action;
  
        const id =
          target.dataset.id;
  
        if (
          action ===
          'open-collection'
        ) {
          openCollection(id);
        }
  
        if (action === 'home') {
          goHome();
        }
  
        if (action === 'archive') {
          document
            .querySelector(
              '#all-entries'
            )
            ?.scrollIntoView({
              behavior: 'smooth'
            });
        }
  
        if (
          action ===
          'toggle-mobile'
        ) {
          state.mobileOpen =
            !state.mobileOpen;
  
          render();
        }
  
        if (
          action ===
          'toggle-tree'
        ) {
          if (
            state.expanded.has(id)
          ) {
            state.expanded.delete(id);
          } else {
            state.expanded.add(id);
          }
  
          render();
        }
  
        if (
          action ===
          'new-collection'
        ) {
          openCollectionModal(
            null,
            target.dataset.parent ||
              null
          );
        }
  
        if (
          action ===
          'edit-collection'
        ) {
          event.stopPropagation();
          openCollectionModal(id);
        }
  
        if (
          action ===
          'delete-collection'
        ) {
          event.stopPropagation();
          requestDeleteCollection(
            id
          );
        }
  
        if (
          action ===
          'new-entry'
        ) {
          openEntryModal();
        }
  
        if (
          action ===
          'edit-entry'
        ) {
          event.stopPropagation();
          openEntryModal(id);
        }
  
        if (
          action ===
          'delete-entry'
        ) {
          event.stopPropagation();
          requestDeleteEntry(id);
        }
  
        if (
          action ===
          'toggle-entry'
        ) {
          state.entries =
            state.entries.map(
              (entry) =>
                entry.id === id
                  ? {
                      ...entry,
                      completed:
                        !entry.completed
                    }
                  : entry
            );
  
          persist();
          render();
        }
  
        if (
          action === 'set-view'
        ) {
          event.stopPropagation();
  
          const view =
            target.dataset.view;
  
          state.viewMode =
            view === 'board'
              ? 'board'
              : 'list';
  
          persist();
          render();
        }
  
        if (
          action ===
          'open-image'
        ) {
          event.stopPropagation();
  
          const entry =
            state.entries.find(
              (item) =>
                item.id === id
            );
  
          if (
            entry &&
            safeImageUrl(
              entry.imageUrl
            )
          ) {
            state.lightbox = {
              id
            };
  
            render();
          }
        }
  
        if (
          action ===
          'close-lightbox'
        ) {
          if (
            target === event.target ||
            target.classList.contains(
              'lightbox-close'
            )
          ) {
            state.lightbox = null;
            render();
          }
        }
  
        if (
          action ===
          'close-modal'
        ) {
          if (
            target === event.target ||
            target.tagName === 'BUTTON'
          ) {
            state.modal = null;
            render();
          }
        }
  
        if (
          action ===
          'close-confirmation'
        ) {
          if (
            target === event.target ||
            target.tagName === 'BUTTON'
          ) {
            state.confirmation = null;
            render();
          }
        }
  
        if (
          action ===
          'confirm-delete'
        ) {
          confirmDelete();
        }
      }
    );
  
    document.addEventListener(
      'submit',
      async (event) => {
        event.preventDefault();
  
        if (
          event.target.dataset.form ===
          'collection'
        ) {
          saveCollection(
            new FormData(
              event.target
            )
          );
        }
  
        if (
          event.target.dataset.form ===
          'entry'
        ) {
          await saveEntry(
            new FormData(
              event.target
            )
          );
        }
      }
    );
  
    document.addEventListener(
      'input',
      (event) => {
        if (
          event.target.id ===
          'archive-search'
        ) {
          const cursor =
            event.target.selectionStart;
  
          state.search =
            event.target.value;
  
          render();
  
          const search =
            document.querySelector(
              '#archive-search'
            );
  
          if (search) {
            search.focus();
  
            search.setSelectionRange(
              cursor,
              cursor
            );
          }
  
          return;
        }
  
        if (
          event.target.id ===
          'entry-image-url'
        ) {
          /*
           * Keep the modal form state
           * synchronized so a render does
           * not lose the typed URL.
           */
          if (
            state.modal?.type ===
            'entry'
          ) {
            state.modal.form.imageUrl =
              event.target.value;
          }
        }
      }
    );
  
    document.addEventListener(
      'change',
      (event) => {
        if (
          event.target.id ===
          'entry-image-file'
        ) {
          const file =
            event.target.files?.[0];
  
          const label =
            document.querySelector(
              '#image-file-name'
            );
  
          if (label) {
            label.textContent =
              file
                ? file.name
                : '';
          }
        }
      }
    );
  
    document.addEventListener(
      'keydown',
      (event) => {
        if (
          event.key === 'Escape'
        ) {
          if (state.lightbox) {
            state.lightbox = null;
            render();
            return;
          }
  
          if (state.confirmation) {
            state.confirmation =
              null;
            render();
            return;
          }
  
          if (state.modal) {
            state.modal = null;
            render();
          }
        }
      }
    );
  
    persist();
    render();
  })();

  if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js");
  });
}

let deferredInstallPrompt;

window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();
  deferredInstallPrompt = event;

  deferredInstallPrompt.prompt();

});
