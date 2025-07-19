'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const MainContainer = styled.main`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 5rem;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 28rem;
  padding: 0 1rem;
`;

const Logo = styled.img`
  max-width: 20rem;
  margin-bottom: 3rem;
`;

const Form = styled.form`
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  padding: 0.5rem 1rem;
  font-size: 1rem;
  color: var(--gray-900);
  background: white;
  transition: var(--transition-normal);
  
  &:focus {
    outline: none;
    border-color: var(--primary-500);
    box-shadow: 0 0 0 3px var(--primary-100);
  }
  
  &::placeholder {
    color: var(--gray-400);
  }
`;

const Button = styled.button`
  width: 100%;
  background: var(--primary-600);
  color: white;
  border-radius: var(--radius-md);
  padding: 0.5rem 1rem;
  margin-top: 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  transition: var(--transition-normal);
  
  &:hover:not(:disabled) {
    background: var(--primary-700);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: var(--error-600);
  text-align: center;
  margin-top: 0.75rem;
  font-size: 1rem;
`;

export default function AuthorizeStorePage() {
  const [storeName, setStoreName] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('status') && params.get('status') === 'fail') {
      setShowError(true);
    }
    if (params.has('storeName')) {
      setStoreName(params.get('storeName') || '');
    }
  }, []);

  return (
    <MainContainer>
      <FormContainer>
        <Logo src="/logo.png" alt="ikas Logo" />
        <Form method="GET" action="/api/oauth/authorize/ikas">
          <Input
            name="storeName"
            placeholder="Mağaza adınızı girin"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            required
          />
          <Button type="submit" disabled={!storeName}>
            Mağazama Ekle
          </Button>
          {showError && (
            <ErrorMessage>
              Bir hata oluştu. Lütfen tekrar deneyin.
            </ErrorMessage>
          )}
        </Form>
      </FormContainer>
    </MainContainer>
  );
} 