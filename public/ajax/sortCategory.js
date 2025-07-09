let currentSort = { key: null, ascending: true };

function sortBy(key) {
  const container = document.getElementById('itemList');
  const items = Array.from(container.querySelectorAll('.card:not(.category)'));

  if (currentSort.key === key) {
    currentSort.ascending = !currentSort.ascending;
  } else {
    currentSort.key = key;
    currentSort.ascending = true;
  }

  items.sort((a, b) => {
    const aVal = a.dataset[key]?.toLowerCase?.() || '';
    const bVal = b.dataset[key]?.toLowerCase?.() || '';

    const aNum = Date.parse(aVal);
    const bNum = Date.parse(bVal);
    const isDate = !isNaN(aNum) && !isNaN(bNum);

    let result = isDate
      ? aNum - bNum
      : aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });

    return currentSort.ascending ? result : -result;
  });

  items.forEach(item => container.appendChild(item));
}

document.querySelectorAll('.folder-link ul').forEach(ul => {
  ul.addEventListener('mouseenter', () => {
    ul.closest('.folder-item')?.classList.add('hovered');
  });
  ul.addEventListener('mouseleave', () => {
    ul.closest('.folder-item')?.classList.remove('hovered');
  });
});