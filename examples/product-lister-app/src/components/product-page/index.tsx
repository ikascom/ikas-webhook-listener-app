import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { ApiRequests } from '../../lib/api-requests';
import {Product, CreateProductInput, UpdateProductInput, ProductTypeEnum} from '../../lib/ikas-client/generated/graphql';

// Props for ProductPage component
interface ProductPageProps {
  token: string | null;
  storeName?: string;
}

// Styled Components (reusing product-page styles)
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  background: #fff;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f0f0f0;
`;

const Title = styled.h1`
  margin: 0;
  color: #1a1a1a;
  font-size: 28px;
  font-weight: 700;
`;

const StoreInfo = styled.div`
  color: #666;
  font-size: 14px;
`;

const AddButton = styled.button`
  background: #28a745;
  color: #fff;
  border: none;
  padding: 14px 28px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(40, 167, 69, 0.2);

  &:hover {
    background: #218838;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  flex-direction: column;
  gap: 16px;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div`
  font-size: 16px;
  color: #666;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 40px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 2px dashed #dee2e6;
`;

const EmptyTitle = styled.h3`
  margin: 0 0 12px 0;
  color: #495057;
  font-size: 20px;
`;

const EmptyText = styled.p`
  margin: 0;
  color: #6c757d;
  font-size: 16px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.thead`
  background: #f8f9fa;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: #f8f9fa;
  }

  &:hover {
    background: #e3f2fd;
  }
`;

const TableHeaderCell = styled.th`
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #495057;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #dee2e6;
`;

const TableCell = styled.td`
  padding: 16px;
  border-bottom: 1px solid #dee2e6;
  vertical-align: middle;
`;

const ProductName = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: #1a1a1a;
  margin-bottom: 4px;
`;

const ProductDescription = styled.div`
  font-size: 14px;
  color: #666;
  max-width: 300px;
  word-break: break-word;
`;

const StockInfo = styled.div`
  font-size: 14px;
  color: #666;
`;

const DateText = styled.div`
  font-size: 13px;
  color: #666;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
`;

const ActionButton = styled.button<{ variant?: 'edit' | 'delete' }>`
  padding: 8px 16px;
  border: 1px solid ${props => {
    switch (props.variant) {
      case 'delete': return '#dc3545';
      case 'edit': return '#007bff';
      default: return '#6c757d';
    }
  }};
  background: ${props => {
    switch (props.variant) {
      case 'delete': return '#fff';
      case 'edit': return '#007bff';
      default: return '#fff';
    }
  }};
  color: ${props => {
    switch (props.variant) {
      case 'delete': return '#dc3545';
      case 'edit': return '#fff';
      default: return '#6c757d';
    }
  }};
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  margin: 0 4px;
  transition: all 0.2s;

  &:hover {
    background: ${props => {
      switch (props.variant) {
        case 'delete': return '#dc3545';
        case 'edit': return '#0056b3';
        default: return '#6c757d';
      }
    }};
    color: #fff;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const Modal = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f0f0f0;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    color: #333;
    background: #f8f9fa;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
`;

const Input = styled.input`
  padding: 14px 16px;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

const TextArea = styled.textarea`
  padding: 14px 16px;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s;
  min-height: 120px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 2px solid #f0f0f0;
`;

const SubmitButton = styled.button`
  background: #28a745;
  color: #fff;
  border: none;
  padding: 14px 32px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    background: #218838;
    transform: translateY(-1px);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const CancelButton = styled.button`
  background: #6c757d;
  color: #fff;
  border: none;
  padding: 14px 32px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: #545b62;
    transform: translateY(-1px);
  }
`;

/**
 * ProductPage component for managing products with table format
 */
const ProductPage: React.FC<ProductPageProps> = ({ token, storeName }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Form state
  const [formData, setFormData] = useState<CreateProductInput | UpdateProductInput>({
    name: '',
    description: '',
    type: ProductTypeEnum.PHYSICAL,
  });

  // Load products on mount and when token changes
  useEffect(() => {
    if (token) {
      loadProducts();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  /**
   * Loads products from the API
   */
  const loadProducts = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await ApiRequests.ikas.listProduct(token);
      if (response.data?.data?.products) {
        setProducts(response.data.data.products);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  /**
   * Opens the modal for creating a new product
   */
  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      type: ProductTypeEnum.PHYSICAL,
    });
    setIsModalOpen(true);
  };

  /**
   * Opens the modal for editing an existing product
   */
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      id: product.id,
      name: product.name,
      description: product.description || '',
      type: ProductTypeEnum.PHYSICAL,
    });
    setIsModalOpen(true);
  };

  /**
   * Closes the modal
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      type: ProductTypeEnum.PHYSICAL,
    });
  };

  /**
   * Handles form submission for saving products
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !formData.name) return;

    setIsSaving(true);
    try {
      if (editingProduct) {
        // Update product
        await ApiRequests.ikas.updateProduct({ productInput: formData as UpdateProductInput }, token);
      } else {
        // Create product
        await ApiRequests.ikas.createProduct({ productInput: formData as CreateProductInput }, token);
      }
      await loadProducts(); // Reload products after saving
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save product:', error);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Formats timestamp to readable date
   */
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!token) {
    return (
      <Container>
        <EmptyState>
          <EmptyTitle>Authentication Required</EmptyTitle>
          <EmptyText>Please authenticate to manage products.</EmptyText>
        </EmptyState>
      </Container>
    );
  }

  return (
    <>
      <Container>
        <Header>
          <div>
            <Title>Product Management</Title>
            {storeName && <StoreInfo>Store: {storeName}</StoreInfo>}
          </div>
          <AddButton onClick={handleAddProduct} disabled={isLoading}>
            <span>+</span>
            Add New Product
          </AddButton>
        </Header>

        {isLoading ? (
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>Loading products...</LoadingText>
          </LoadingContainer>
        ) : products.length === 0 ? (
          <EmptyState>
            <EmptyTitle>No Products Found</EmptyTitle>
            <EmptyText>Click Add New Product to create your first product.</EmptyText>
          </EmptyState>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Product Name</TableHeaderCell>
                <TableHeaderCell>Brand</TableHeaderCell>
                <TableHeaderCell>Stock</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <ProductName>{product.name}</ProductName>
                    <ProductDescription>{product.description}</ProductDescription>
                  </TableCell>
                  <TableCell>
                    <StockInfo>{product.brand?.name || 'No Brand'}</StockInfo>
                  </TableCell>
                  <TableCell>
                    <StockInfo>{product.totalStock || 0}</StockInfo>
                  </TableCell>
                  <TableCell>
                    <ActionButton
                      variant="edit"
                      onClick={() => handleEditProduct(product)}
                    >
                      Edit
                    </ActionButton>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        )}
      </Container>

      {isModalOpen && (
        <ModalOverlay onClick={handleCloseModal}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </ModalTitle>
              <CloseButton onClick={handleCloseModal}>
                ×
              </CloseButton>
            </ModalHeader>

            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter product name"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="description">Description</Label>
                <TextArea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter product description"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="type">Product Type</Label>
                <Input
                  id="type"
                  type="text"
                  value={formData.type || ProductTypeEnum.PHYSICAL}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as ProductTypeEnum }))}
                  placeholder="PHYSICAL"
                />
              </FormGroup>

              <ButtonGroup>
                <CancelButton type="button" onClick={handleCloseModal}>
                  Cancel
                </CancelButton>
                <SubmitButton
                  type="submit"
                  disabled={isSaving || !formData.name}
                >
                  {isSaving && <LoadingSpinner style={{ width: '16px', height: '16px' }} />}
                  {editingProduct ? 'Update' : 'Create'} Product
                </SubmitButton>
              </ButtonGroup>
            </Form>
          </Modal>
        </ModalOverlay>
      )}
    </>
  );
};

export default ProductPage;
