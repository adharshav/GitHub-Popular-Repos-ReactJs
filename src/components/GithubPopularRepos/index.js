import {Component} from 'react'
import Loader from 'react-loader-spinner'
import LanguageFilterItem from '../LanguageFilterItem'
import RepositoryItem from '../RepositoryItem'
import './index.css'

const languageFiltersData = [
  {id: 'ALL', language: 'All'},
  {id: 'JAVASCRIPT', language: 'Javascript'},
  {id: 'RUBY', language: 'Ruby'},
  {id: 'JAVA', language: 'Java'},
  {id: 'CSS', language: 'CSS'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class GitHubPopularRepos extends Component {
  state = {
    repositoriesData: [],
    activeFilterId: languageFiltersData[0].id,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getRepositoryItems()
  }

  updateActiveFilterId = activeFilterId => {
    this.setState({activeFilterId}, this.getRepositoryItems)
  }

  getRepositoryItems = async () => {
    const {activeFilterId} = this.state
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const response = await fetch(
      `https://apis.ccbp.in/popular-repos?language=${activeFilterId}`,
    )
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = data.popular_repos.map(eachItem => ({
        name: eachItem.name,
        id: eachItem.id,
        issuesCount: eachItem.issues_count,
        forksCount: eachItem.forks_count,
        starsCount: eachItem.stars_count,
        avatarUrl: eachItem.avatar_url,
      }))
      this.setState({
        repositoriesData: updatedData,
        apiStatus: apiStatusConstants.failure,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderRepositoriesList = () => {
    const {repositoriesData} = this.state
    return (
      <ul className="repositories-list">
        {repositoriesData.map(eachRepos => (
          <RepositoryItem key={eachRepos.id} reposDetails={eachRepos} />
        ))}
      </ul>
    )
  }

  renderFilterList = () => {
    const {activeFilterId} = this.state
    return (
      <ul className="filter-list-container">
        {languageFiltersData.map(eachitem => (
          <LanguageFilterItem
            filterDetails={eachitem}
            key={eachitem.id}
            isSelected={activeFilterId === eachitem.id}
            updateActiveFilterId={this.updateActiveFilterId}
          />
        ))}
      </ul>
    )
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0284c7" height={80} width={80} />
    </div>
  )

  renderContentBasedOnStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderRepositoriesList()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  renderFailureView = () => (
    <>
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-view-img"
      />
      <p className="failure-msg">Something Went Wrong</p>
    </>
  )

  render() {
    return (
      <div className="app-container">
        <div className="repository-container">
          <h1 className="heading">Popular</h1>
          {this.renderFilterList()}
          {this.renderContentBasedOnStatus()}
        </div>
      </div>
    )
  }
}

export default GitHubPopularRepos
