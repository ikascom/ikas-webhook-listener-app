'use client';

import React, { useEffect, useCallback, useState } from 'react';
import styled from 'styled-components';

// Styled-components for layout and UI
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

const StyledForm = styled.form`
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

/**
 * AuthorizeStorePage
 * - Renders a form for the user to enter their store name and authorize the app.
 * - Handles error display if redirected back with a failure status.
 */
const AuthorizeStorePage: React.FC = () => {
  // State for the store name input
  const [storeName, setStoreName] = useState('');
  // State to control error message visibility
  const [showError, setShowError] = useState(false);

  // Parse query params on mount to prefill storeName and show error if needed
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('status') === 'fail') {
      setShowError(true);
    }
    const store = params.get('storeName');
    if (store) {
      setStoreName(store);
    }
  }, []);

  // Handler for input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setStoreName(e.target.value);
      if (showError) setShowError(false); // Hide error on user input
    },
    [showError]
  );

  return (
    <MainContainer>
      <FormContainer>
        <Logo src="/logo.png" alt="ikas Logo" />
        {/* 
          Form submits storeName as a GET param to the OAuth authorize endpoint.
          Button is disabled if input is empty.
        */}
        <StyledForm method="GET" action="/api/oauth/authorize/ikas" autoComplete="off">
          <Input
            name="storeName"
            placeholder="Enter your store name"
            value={storeName}
            onChange={handleInputChange}
            required
            autoFocus
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="none"
          />
          <Button type="submit" disabled={!storeName.trim()}>
            Add to My Store
          </Button>
          {showError && (
            <ErrorMessage>
              An error occurred. Please try again.
            </ErrorMessage>
          )}
        </StyledForm>
      </FormContainer>
    </MainContainer>
  );
};

export default AuthorizeStorePage;