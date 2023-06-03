import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { QueryClient, QueryClientProvider, useMutation, useQuery } from 'react-query';
import axios from 'axios';

const queryClient = new QueryClient();

const App = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const url = 'https://645402c7e9ac46cedf35a20e.mockapi.io/clothes';

  const { data: clothes, refetch } = useQuery("supplierData", async () => {
    const response = await axios.get(url);
    return response.data;
  }, {
    staleTime: 30000,
    refetchInterval: 5000
  });

  const deleteById = useMutation((id) => {
    return axios.delete(`${url}/${id}`);
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries("supplierData");
    },
    onError: (err) => {
      console.log('Error!', err);
    }
  });

  const addTo = useMutation((data) => {
    return axios.post(url, data);
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries("supplierData");
    },
    onError: (err) => {
      console.log('Error!', err);
    }
  });

  const renderItem = ({ item }:any) => {
    return (
      <View style={{ width: 180, marginTop: 20, borderRadius: 8, borderWidth: 1, borderColor: "black", gap: 10 }}>
        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 20, color: "black" }}>{item.name}</Text>
          <Text style={{ color: "blue", fontWeight: "500", fontSize: 16 }}>${item.price}</Text>
        </View>
        <TouchableOpacity style={{ paddingLeft: 8, marginBottom: 10 }} onPress={() => deleteById.mutate(item.id)}>
          <Text style={{
            paddingLeft: 10,
            backgroundColor: "red",
            width: 70,
            fontSize: 18,
            color: "white",
            borderRadius: 5,
            justifyContent: "flex-end",
            flexDirection: "row"
          }}>Delete</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View><Text style={styles.titleSty}>Create Data</Text></View>
      <View style={{ gap: 5 }}>
        <TextInput style={styles.inputStyle} placeholder='Name' onChangeText={setName} />
        <TextInput style={styles.inputStyle} placeholder='Price' onChangeText={setPrice} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
        <TouchableOpacity onPress={refetch}>
          <Text style={styles.opeSty}>Refetch</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => addTo.mutate({ name: name, price: price })}>
          <Text style={styles.opeSty}>Create</Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: 10 }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={clothes}
          renderItem={renderItem}
        />
      </View>
    </SafeAreaView>
  );
};

const RootComponent = () => (
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);

export default RootComponent;

const styles = StyleSheet.create({
  opeSty: {
    fontSize: 15,
    color: "white",
    backgroundColor: "green",
    padding: 5,
    borderRadius: 7,
  },
  titleSty: {
    fontSize: 25,
    color: "black",
    fontWeight: "700"
  },
  inputStyle: {
    marginTop: 10,
    borderWidth: 1,
    padding: 7,
    borderColor: "gray",
    borderRadius: 10
  },
  container: {
    flex: 1,
    margin: 15,
  }
});
