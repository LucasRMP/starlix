import React from 'react';
import PT from 'prop-types';
import { WebView } from 'react-native-webview';

// import { Container } from './styles';

function Repo({ navigation }) {
  const { html_url: uri } = navigation.getParam('repo');

  return <WebView source={{ uri }} />;
}

Repo.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('repo').name,
});

Repo.propTypes = {
  navigation: PT.shape({
    getParam: PT.func,
  }).isRequired,
};

export default Repo;
