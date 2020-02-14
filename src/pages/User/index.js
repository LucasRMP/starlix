import React, { useEffect, useState } from 'react';
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
} from './styles';

function User({ navigation }) {
  const [stars, setStars] = useState([]);
  const [user, setUser] = useState([]);

  useEffect(() => {
    const componentDidMount = async () => {
      const userParam = navigation.getParam('user');
      setUser(userParam);
      const res = await api.get(`/users/${userParam.login}/starred`);
      setStars(res.data);
    };
    componentDidMount();
  }, []);

  return (
    <Container>
      <Header>
        <Avatar source={{ uri: user.avatar_url }} />
        <Name>{user.name}</Name>
        <Bio>{user.bio}</Bio>
      </Header>

      <Stars
        data={stars}
        keyExtractor={star => String(star.id)}
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
    </Container>
  );
}

User.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('user').name,
});

User.propTypes = {
  navigation: PT.shape({
    getParam: PT.func,
  }).isRequired,
};

export default User;
