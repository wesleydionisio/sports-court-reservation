// src/pages/NotFound.js
import React from 'react';
import { Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Alert variant="warning">
      <Alert.Heading>Página Não Encontrada</Alert.Heading>
      <p>
        A página que você está procurando não existe. Por favor, verifique o URL ou volte para a página inicial.
      </p>
      <hr />
      <p className="mb-0">
        <Link to="/">Voltar para a Página Inicial</Link>
      </p>
    </Alert>
  );
};

export default NotFound;