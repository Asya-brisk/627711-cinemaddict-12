const createFilterItemTemplate = (filter, isActive) => {
  const {name, count} = filter;

  const nameInUpperCase = name[0].toUpperCase() + name.substring(1);

   return (
    `<a href="#${name}" class="main-navigation__item">
    ${nameInUpperCase} <span class="main-navigation__item-count ${count > 5 ? `visually-hidden` : ``}">${count}</span></a>`
  );
};

export const createSiteMenuTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join(``);

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
        ${filterItemsTemplate}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};
