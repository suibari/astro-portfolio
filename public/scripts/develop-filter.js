// Both the tag list and card tags control the same filter.
(() => {
  function initializeFilters() {
    const grid = document.getElementById('developments-grid');
    if (!grid) return;
    const buttons = document.querySelectorAll('[data-filter-tag]');
    const items = grid.querySelectorAll('.content-item');

    function filterItems(tag) {
      buttons.forEach(button => {
        const selected = button.dataset.filterTag === tag;
        button.setAttribute('aria-pressed', String(selected));
        button.classList.toggle('ring-2', selected);
        button.classList.toggle('ring-accent-orange', selected);
      });
      items.forEach(item => {
        const tags = (item.dataset.tags || '').split(',');
        item.hidden = tag !== 'All' && !tags.includes(tag);
      });
    }

    buttons.forEach(button => {
      button.onclick = () => filterItems(button.dataset.filterTag);
    });
    filterItems('All');
  }

  initializeFilters();
  document.addEventListener('astro:page-load', initializeFilters);
})();
