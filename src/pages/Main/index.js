import React, { useState, useEffect } from 'react';
import { Keyboard, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import PT from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';

import api from '../../services/api';

import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  User,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText,
} from './styles';

function Main({ navigation }) {
  const [userInput, setUserInput] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const componentDidMount = async () => {
      const unparsedUsers = await AsyncStorage.getItem('users');

      setUsers(unparsedUsers ? JSON.parse(unparsedUsers) : []);
    };
    componentDidMount();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const handleSubmit = async () => {
    setLoading(true);
    if (userInput === '') {
      setLoading(false);
      return;
    }

    const { data: user } = await api.get(`/users/${userInput}`);

    if (!user) {
      setLoading(false);
      return;
    }

    const { name, login, bio, avatar_url } = user;

    setUsers([...users, { name, login, bio, avatar_url }]);
    setUserInput('');
    Keyboard.dismiss();
    setLoading(false);
  };

  const handleNavigate = user => {
    navigation.navigate('User', { user });
  };

  return (
    <Container>
      <Form>
        <Input
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Add new User"
          value={userInput}
          onChangeText={setUserInput}
          returnKeyType="send"
          onSubmitEditing={handleSubmit}
        />
        <SubmitButton loading={loading} onPress={handleSubmit}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Icon name="add" size={20} color="#fff" />
          )}
        </SubmitButton>
      </Form>

      <List
        data={users}
        keyExtractor={user => user.login}
        renderItem={({ item }) => (
          <User>
            <Avatar source={{ uri: item.avatar_url }} />
            <Name>{item.name}</Name>
            <Bio>{item.bio}</Bio>

            <ProfileButton onPress={() => handleNavigate(item)}>
              <ProfileButtonText>See Profile</ProfileButtonText>
            </ProfileButton>
          </User>
        )}
      />
    </Container>
  );
}

Main.navigationOptions = {
  title: 'Users',
};

Main.propTypes = {
  navigation: PT.shape({
    navigate: PT.func,
  }).isRequired,
};

export default Main;
