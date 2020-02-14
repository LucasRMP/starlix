import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import PT from 'prop-types';

import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  Indicator,
} from './styles';

function User({ navigation }) {
  const [stars, setStars] = useState([]);
  const [user, setUser] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [noMoreStars, setNoMoreStars] = useState(false);

  useEffect(() => {
    const componentDidMount = async () => {
      setLoading(true);
      const userParam = navigation.getParam('user');
      setUser(userParam);
      const res = await api.get(`/users/${userParam.login}/starred`);
      setStars(res.data);
      setLoading(false);
    };
    componentDidMount();
  }, []);

  const loadMoreStars = async () => {
    if (noMoreStars) return;
    try {
      const res = await api.get(
        `/users/${user.login}/starred?page=${page + 1}`
      );
      console.tron.log(res.data.length);
      if (!res.data || res.data.length === 0) {
        setNoMoreStars(true);
        return;
      }

      const newStars = [...stars, ...res.data];

      setStars(newStars);
      setPage(page + 1);
    } catch (e) {
      console.tron.error(e);
    }
  };

  return (
    <Container>
      <Header>
        <Avatar source={{ uri: user.avatar_url }} />
        <Name>{user.name}</Name>
        <Bio>{user.bio}</Bio>
      </Header>

      {loading ? (
        <ActivityIndicator color="#7159c1" style={{ marginTop: 20 }} />
      ) : (
        <Stars
          data={stars}
          keyExtractor={star => String(star.id)}
          onEndReachedThreshold={0.2}
          onEndReached={loadMoreStars}
          ListFooterComponent={
            noMoreStars ? (
              <Indicator>No more stars</Indicator>
            ) : (
              <ActivityIndicator color="#7159c1" />
            )
          }
          renderItem={({ item }) => (
            <Starred>
              <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
              <Info>
                <Title>{item.name}</Title>
                <Author>{item.owner.login}</Author>
              </Info>
            </Starred>
          )}
        />
      )}
    </Container>
  );
}

User.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('user').login,
});

User.propTypes = {
  navigation: PT.shape({
    getParam: PT.func,
  }).isRequired,
};

export default User;
