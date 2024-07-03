import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PostItem from './PostItem';
import PostForm from './PostForm';
import { getPosts } from '../../action/post';
import Spinner from '../layout/Spinner';

const Posts = ({ getPosts, post: { posts = [], loading, error } }) => {
  useEffect(() => {
    getPosts();
  }, [getPosts]);

  console.log('Posts Component - Posts:', posts); // Add console log for debugging

  return (
    <Fragment>
      <h1 className='large text-primary'>Posts</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Welcome to the community
      </p>
      <PostForm />
      <div className='posts'>
        {loading ? (
          <Spinner /> // Display spinner while loading
        ) : error ? (
          <div className='alert alert-danger'>Error fetching posts</div>
        ) : posts.length > 0 ? (
          posts.map((post) => <PostItem key={post._id} post={post} />)
        ) : (
          <h4>No posts found</h4>
        )}
      </div>
    </Fragment>
  );
};

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.shape({
    posts: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.object, // Allow for error object
  }).isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
});

export default connect(mapStateToProps, { getPosts })(Posts);
