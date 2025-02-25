// components/profile/ProfileGithub.js
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getGithubRepos } from '../../action/profile';
import Spinner from '../layout/Spinner';

const ProfileGithub = ({
  username,
  getGithubRepos,
  profile: { repos, loading },
}) => {
  useEffect(() => {
    getGithubRepos(username);
  }, [getGithubRepos, username]);

  return (
    <div className='profile-github'>
      <h2 className='text-primary my-1'>
        <i className='fab fa-github' /> Github Repos
      </h2>
      {loading ? (
        <Spinner />
      ) : repos && repos.length > 0 ? (
        repos.map((repo) => (
          <div key={repo.id} className='repo bg-white p-1 my-1'>
            <div>
              <h4>
                <a
                  href={repo.html_url}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {repo.name}
                </a>
              </h4>
              <p>{repo.description}</p>
            </div>
            <div>
              <ul>
                <li className='badge badge-primary'>
                  Stars: {repo.stargazers_count}
                </li>
                <li className='badge badge-dark'>
                  Watchers: {repo.watchers_count}
                </li>
                <li className='badge badge-light'>Forks: {repo.forks_count}</li>
              </ul>
            </div>
          </div>
        ))
      ) : (
        <h4>No Github repositories found</h4>
      )}
    </div>
  );
};

ProfileGithub.propTypes = {
  getGithubRepos: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { getGithubRepos })(ProfileGithub);
