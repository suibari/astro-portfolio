// This script handles the tag filtering for the development page.

let selectedTag = 'All';
const tagButtons = document.querySelectorAll('.tag-button'); // Assuming buttons have class 'tag-button'
const developmentsGrid = document.getElementById('developments-grid');
const allItems = developmentsGrid ? developmentsGrid.querySelectorAll('.content-item') : [];

console.log('Tag buttons found:', tagButtons.length);
console.log('All items found:', allItems.length);

function updateButtonStyles() {
  tagButtons.forEach(button => {
    if (button.dataset.tag === selectedTag) {
      // Add active styling
      button.classList.add('bg-blue-500', 'text-white');
      button.classList.remove('border-gray-300', 'hover:bg-gray-100');
    } else {
      // Remove active styling
      button.classList.remove('bg-blue-500', 'text-white');
      button.classList.add('border-gray-300', 'hover:bg-gray-100');
    }
  });
}

function filterItems(tag) {
  selectedTag = tag;
  updateButtonStyles(); // Update button styles

  if (!developmentsGrid) return;

  allItems.forEach(item => {
    const itemTagsString = item.dataset.tags;
    if (!itemTagsString) {
      // If no tags, hide it unless the selected tag is 'All'
      item.style.display = (tag === 'All') ? 'block' : 'none';
      return;
    }

    const itemTags = itemTagsString.split(',');

    if (tag === 'All') {
      item.style.display = 'block';
    } else {
      if (itemTags.includes(tag)) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    }
  });
}

// Add event listeners to tag buttons and set initial state
document.addEventListener('astro:page-load', () => {
  // Add class to buttons for easier selection and attach event listeners
  tagButtons.forEach(button => {
    button.classList.add('tag-button'); // Ensure class is present
    button.addEventListener('click', () => filterItems(button.dataset.tag));
  });

  // Set initial filter and update button styles
  filterItems(selectedTag);
});
