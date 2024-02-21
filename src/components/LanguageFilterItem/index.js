import './index.css'

const LanguageFilterItem = props => {
  const {isSelected, filterDetails, updateActiveFilterId} = props
  const btnClassName = isSelected
    ? 'language-btn selected-language-btn'
    : 'language-btn'

  const onClickLanguageFilter = () => {
    updateActiveFilterId(filterDetails.id)
  }
  return (
    <li className="filter-list-items">
      <button
        type="button"
        className={btnClassName}
        onClick={onClickLanguageFilter}
      >
        {filterDetails.language}
      </button>
    </li>
  )
}

export default LanguageFilterItem
