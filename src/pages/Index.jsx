import React, { useState } from "react";
import { Box, Button, Flex, FormControl, FormLabel, Input, Select, Text, VStack, HStack, IconButton, useToast, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash, FaFileDownload } from "react-icons/fa";

const initialTransactions = [
  {
    id: 1,
    date: "2023-01-01",
    amount: 500,
    type: "income",
    category: "salary",
  },
  {
    id: 2,
    date: "2023-01-05",
    amount: 100,
    type: "expense",
    category: "groceries",
  },
];

const categories = ["groceries", "bills", "salary", "entertainment", "other"];

const Index = () => {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [newTransaction, setNewTransaction] = useState({
    date: "",
    amount: "",
    type: "expense",
    category: "groceries",
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState({ type: "", category: "", dateFrom: "", dateTo: "" });
  const toast = useToast();

  const handleInputChange = (e) => {
    setNewTransaction({
      ...newTransaction,
      [e.target.name]: e.target.value,
    });
  };

  const addTransaction = () => {
    if (newTransaction.date && newTransaction.amount) {
      setTransactions([
        ...transactions,
        {
          id: Math.max(0, ...transactions.map((t) => t.id)) + 1,
          ...newTransaction,
        },
      ]);
      setNewTransaction({
        date: "",
        amount: "",
        type: "expense",
        category: "groceries",
      });
      toast({
        title: "Transaction added",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Please fill in all fields",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const editTransaction = (id) => {
    const transaction = transactions.find((t) => t.id === id);
    setEditMode(true);
    setEditId(id);
    setNewTransaction({
      date: transaction.date,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
    });
  };

  const updateTransaction = () => {
    setTransactions(transactions.map((transaction) => (transaction.id === editId ? { ...transaction, ...newTransaction } : transaction)));
    setEditMode(false);
    setEditId(null);
    setNewTransaction({ date: "", amount: "", type: "expense", category: "groceries" });
    toast({
      title: "Transaction updated",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((transaction) => transaction.id !== id));
    toast({
      title: "Transaction deleted",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  const applyFilter = (transactions) => {
    return transactions.filter((transaction) => {
      const matchType = filter.type ? transaction.type === filter.type : true;
      const matchCategory = filter.category ? transaction.category === filter.category : true;
      const matchDateFrom = filter.dateFrom ? new Date(transaction.date) >= new Date(filter.dateFrom) : true;
      const matchDateTo = filter.dateTo ? new Date(transaction.date) <= new Date(filter.dateTo) : true;
      return matchType && matchCategory && matchDateFrom && matchDateTo;
    });
  };

  const exportTransactions = () => {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(transactions))}`;
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "transactions.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const filteredTransactions = applyFilter(transactions);
  const totalBalance = transactions.reduce((acc, transaction) => (transaction.type === "income" ? acc + parseFloat(transaction.amount) : acc - parseFloat(transaction.amount)), 0);

  return (
    <Box p={8}>
      <VStack spacing={4} align="stretch">
        {/* Add/Edit Transaction Form */}
        <Box p={4} borderWidth="1px" borderRadius="lg">
          <Text fontSize="xl" mb={4}>
            {editMode ? "Edit Transaction" : "Add New Transaction"}
          </Text>
          <Flex>
            <FormControl id="date" mr={2}>
              <FormLabel>Date</FormLabel>
              <Input type="date" name="date" value={newTransaction.date} onChange={handleInputChange} />
            </FormControl>
            <FormControl id="amount" mr={2}>
              <FormLabel>Amount</FormLabel>
              <Input type="number" name="amount" value={newTransaction.amount} onChange={handleInputChange} />
            </FormControl>
            <FormControl id="type" mr={2}>
              <FormLabel>Type</FormLabel>
              <Select name="type" value={newTransaction.type} onChange={handleInputChange}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </Select>
            </FormControl>
            <FormControl id="category">
              <FormLabel>Category</FormLabel>
              <Select name="category" value={newTransaction.category} onChange={handleInputChange}>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Flex>
          <Button leftIcon={editMode ? <FaEdit /> : <FaPlus />} colorScheme="blue" mt={4} onClick={editMode ? updateTransaction : addTransaction}>
            {editMode ? "Update Transaction" : "Add Transaction"}
          </Button>
        </Box>

        {/* Filter Transactions */}
        <Box p={4} borderWidth="1px" borderRadius="lg">
          <Text fontSize="xl" mb={4}>
            Filter Transactions
          </Text>
          <Flex>
            <FormControl id="filterType" mr={2}>
              <FormLabel>Type</FormLabel>
              <Select placeholder="All" value={filter.type} onChange={(e) => setFilter({ ...filter, type: e.target.value })}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </Select>
            </FormControl>
            <FormControl id="filterCategory" mr={2}>
              <FormLabel>Category</FormLabel>
              <Select placeholder="All" value={filter.category} onChange={(e) => setFilter({ ...filter, category: e.target.value })}>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl id="filterDateFrom" mr={2}>
              <FormLabel>From</FormLabel>
              <Input type="date" value={filter.dateFrom} onChange={(e) => setFilter({ ...filter, dateFrom: e.target.value })} />
            </FormControl>
            <FormControl id="filterDateTo">
              <FormLabel>To</FormLabel>
              <Input type="date" value={filter.dateTo} onChange={(e) => setFilter({ ...filter, dateTo: e.target.value })} />
            </FormControl>
          </Flex>
        </Box>

        {/* Transaction List */}
        <Box p={4} borderWidth="1px" borderRadius="lg">
          <Text fontSize="xl" mb={4}>
            Transactions
          </Text>
          <Table>
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Amount</Th>
                <Th>Type</Th>
                <Th>Category</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredTransactions.map((transaction) => (
                <Tr key={transaction.id}>
                  <Td>{transaction.date}</Td>
                  <Td>{transaction.amount}</Td>
                  <Td>{transaction.type}</Td>
                  <Td>{transaction.category}</Td>
                  <Td>
                    <IconButton aria-label="Edit" icon={<FaEdit />} size="sm" mr={2} onClick={() => editTransaction(transaction.id)} />
                    <IconButton aria-label="Delete" icon={<FaTrash />} size="sm" onClick={() => deleteTransaction(transaction.id)} />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {filteredTransactions.length === 0 && <Text mt={4}>No transactions found.</Text>}
        </Box>

        {/* Summary and Export */}
        <HStack justifyContent="space-between" p={4} borderWidth="1px" borderRadius="lg">
          <Text fontSize="xl">Total Balance: ${totalBalance}</Text>
          <Button leftIcon={<FaFileDownload />} onClick={exportTransactions}>
            Export JSON
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default Index;
