import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { ApiRequests } from '@/lib/api-requests';
import { Webhook, WebhookInput, SalesChannel } from '@/lib/ikas-client/generated/graphql';
import { WebhookScope } from '@ikas/admin-api-client';

// Props for WebhookPage component
interface WebhookPageProps {
  token: string | null;
  storeName?: string;
}

// Styled Components
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

const WebhookUrl = styled.div`
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  color: #0066cc;
  word-break: break-all;
  max-width: 300px;
`;

const ScopeTag = styled.span`
  display: inline-block;
  padding: 4px 8px;
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  margin: 2px;
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
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

const ScopesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px solid #dee2e6;
`;

const SalesChannelContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
  padding: 16px;
  background: #f1f8ff;
  border-radius: 8px;
  border: 2px solid #dee2e6;
  max-height: 200px;
  overflow-y: auto;
`;

const ScopeCheckbox = styled.label<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 2px solid ${props => props.selected ? '#007bff' : '#dee2e6'};
  background: ${props => props.selected ? '#007bff' : '#fff'};
  color: ${props => props.selected ? '#fff' : '#495057'};
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  user-select: none;

  &:hover {
    border-color: #007bff;
    background: ${props => props.selected ? '#0056b3' : '#e3f2fd'};
  }

  input {
    display: none;
  }
`;

const SalesChannelCheckbox = styled.label<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 2px solid ${props => props.selected ? '#28a745' : '#dee2e6'};
  background: ${props => props.selected ? '#28a745' : '#fff'};
  color: ${props => props.selected ? '#fff' : '#495057'};
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  user-select: none;
  min-width: 120px;

  &:hover {
    border-color: #28a745;
    background: ${props => props.selected ? '#218838' : '#e8f5e8'};
  }

  input {
    display: none;
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

// Available webhook scopes
const WEBHOOK_SCOPES = Object.values(WebhookScope);

/**
 * WebhookPage component for managing webhooks with table format
 */
const WebhookPage: React.FC<WebhookPageProps> = ({ token, storeName }) => {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [salesChannels, setSalesChannels] = useState<SalesChannel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingSalesChannels, setIsLoadingSalesChannels] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<WebhookInput>({
    endpoint: '',
    scopes: [],
    salesChannelIds: []
  });

  // Load webhooks and sales channels on mount and when token changes
  useEffect(() => {
    if (token) {
      loadWebhooks();
      loadSalesChannels();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  /**
   * Loads webhooks from the API
   */
  const loadWebhooks = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await ApiRequests.ikas.listWebhook(token);
      if (response.data?.data?.webhooks) {
        setWebhooks(response.data.data.webhooks.filter(w => !w.deleted));
      }
    } catch (error) {
      console.error('Failed to load webhooks:', error);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  /**
   * Loads sales channels from the API
   */
  const loadSalesChannels = useCallback(async () => {
    if (!token) return;

    setIsLoadingSalesChannels(true);
    try {
      const response = await ApiRequests.ikas.listSalesChannel(token);
      if (response.data?.data?.salesChannels) {
        setSalesChannels(response.data.data.salesChannels);
      }
    } catch (error) {
      console.error('Failed to load sales channels:', error);
    } finally {
      setIsLoadingSalesChannels(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  /**
   * Opens the modal for creating a new webhook
   */
  const handleAddWebhook = () => {
    setEditingWebhook(null);
    setFormData({
      endpoint: '',
      scopes: [],
      salesChannelIds: []
    });
    setIsModalOpen(true);
  };

  /**
   * Opens the modal for editing an existing webhook
   */
  const handleEditWebhook = (webhook: Webhook) => {
    setEditingWebhook(webhook);
    setFormData({
      endpoint: webhook.endpoint,
      scopes: [webhook.scope], // Convert single scope to array for editing
      salesChannelIds: [] // salesChannelIds field doesn't exist in Webhook interface
    });
    setIsModalOpen(true);
  };

  /**
   * Closes the modal
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingWebhook(null);
    setFormData({
      endpoint: '',
      scopes: [],
      salesChannelIds: []
    });
  };

  /**
   * Handles form submission for saving webhooks
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !formData.endpoint || formData.scopes.length === 0) return;

    setIsSaving(true);
    try {
      await ApiRequests.ikas.saveWebhook({ webhookInput: formData }, token);
      await loadWebhooks(); // Reload webhooks after saving
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save webhook:', error);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Handles webhook deletion
   */
  const handleDeleteWebhook = async (webhook: Webhook) => {
    if (!token) return;

    // Confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete this webhook?\n\nEndpoint: ${webhook.endpoint}\nScope: ${webhook.scope}\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    setIsDeleting(webhook.id);
    try {
      await ApiRequests.ikas.deleteWebhook({ scopes: webhook.scope }, token);
      await loadWebhooks(); // Reload webhooks after deletion
    } catch (error) {
      console.error('Failed to delete webhook:', error);
      alert('Failed to delete webhook. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };

  /**
   * Toggles scope selection
   */
  const toggleScope = (scope: string) => {
    setFormData(prev => ({
      ...prev,
      scopes: prev.scopes.includes(scope)
        ? prev.scopes.filter(s => s !== scope)
        : [...prev.scopes, scope]
    }));
  };

  /**
   * Toggles sales channel selection
   */
  const toggleSalesChannel = (salesChannelId: string) => {
    setFormData(prev => {
      const currentIds = prev.salesChannelIds || [];
      return {
        ...prev,
        salesChannelIds: currentIds.includes(salesChannelId)
          ? currentIds.filter(id => id !== salesChannelId)
          : [...currentIds, salesChannelId]
      };
    });
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
          <EmptyText>Please authenticate to manage webhooks.</EmptyText>
        </EmptyState>
      </Container>
    );
  }

  return (
    <>
      <Container>
        <Header>
          <div>
            <Title>Webhook Management kardeeeş</Title>
            {storeName && <StoreInfo>Store: {storeName}</StoreInfo>}
          </div>
          <AddButton onClick={handleAddWebhook} disabled={isLoading}>
            <span>+</span>
            Add New Webhook
          </AddButton>
        </Header>

        {isLoading ? (
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>Loading webhooks...</LoadingText>
          </LoadingContainer>
        ) : webhooks.length === 0 ? (
          <EmptyState>
            <EmptyTitle>No Webhooks Found</EmptyTitle>
            <EmptyText>Click Add New Webhook to create your first webhook endpoint.</EmptyText>
          </EmptyState>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Endpoint URL</TableHeaderCell>
                <TableHeaderCell>Scope</TableHeaderCell>
                <TableHeaderCell>Created</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {webhooks.map((webhook) => (
                <TableRow key={webhook.id}>
                  <TableCell>
                    <WebhookUrl>{webhook.endpoint}</WebhookUrl>
                  </TableCell>
                  <TableCell>
                    <ScopeTag>{webhook.scope}</ScopeTag>
                  </TableCell>
                  <TableCell>
                    <DateText>{formatDate(webhook.createdAt)}</DateText>
                  </TableCell>
                  <TableCell>
                    <ActionButton
                      variant="edit"
                      onClick={() => handleEditWebhook(webhook)}
                      disabled={isDeleting === webhook.id}
                    >
                      Edit
                    </ActionButton>
                    <ActionButton
                      variant="delete"
                      onClick={() => handleDeleteWebhook(webhook)}
                      disabled={isDeleting === webhook.id}
                    >
                      {isDeleting === webhook.id ? (
                        <>
                          <LoadingSpinner style={{ width: '12px', height: '12px' }} />
                          Deleting...
                        </>
                      ) : (
                        'Delete'
                      )}
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
                {editingWebhook ? 'Edit Webhook' : 'Add New Webhook'}
              </ModalTitle>
              <CloseButton onClick={handleCloseModal}>
                ×
              </CloseButton>
            </ModalHeader>

            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="endpoint">Webhook Endpoint URL</Label>
                <Input
                  id="endpoint"
                  type="url"
                  value={formData.endpoint}
                  onChange={(e) => setFormData(prev => ({ ...prev, endpoint: e.target.value }))}
                  placeholder="https://your-app.com/webhooks/ikas"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Select Webhook Scopes</Label>
                <ScopesContainer>
                  {WEBHOOK_SCOPES.map((scope) => (
                    <ScopeCheckbox
                      key={scope}
                      selected={formData.scopes.includes(scope)}
                    >
                      <input
                        type="checkbox"
                        checked={formData.scopes.includes(scope)}
                        onChange={() => toggleScope(scope)}
                      />
                      {scope.replace('_', ' ').toUpperCase()}
                    </ScopeCheckbox>
                  ))}
                </ScopesContainer>
              </FormGroup>

              <FormGroup>
                <Label>Select Sales Channels (Optional)</Label>
                {isLoadingSalesChannels ? (
                  <div style={{ padding: '20px', textAlign: 'center' }}>
                    <LoadingSpinner style={{ width: '20px', height: '20px' }} />
                    <div style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
                      Loading sales channels...
                    </div>
                  </div>
                ) : salesChannels.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', background: '#f8f9fa', borderRadius: '8px', border: '2px solid #dee2e6' }}>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      No sales channels found
                    </div>
                  </div>
                ) : (
                  <SalesChannelContainer>
                    {salesChannels.map((channel) => (
                      <SalesChannelCheckbox
                        key={channel.id}
                        selected={formData.salesChannelIds?.includes(channel.id) || false}
                      >
                        <input
                          type="checkbox"
                          checked={formData.salesChannelIds?.includes(channel.id) || false}
                          onChange={() => toggleSalesChannel(channel.id)}
                        />
                        {channel.name || `Channel ${channel.id}`}
                      </SalesChannelCheckbox>
                    ))}
                  </SalesChannelContainer>
                )}
              </FormGroup>

              <ButtonGroup>
                <CancelButton type="button" onClick={handleCloseModal}>
                  Cancel
                </CancelButton>
                <SubmitButton
                  type="submit"
                  disabled={isSaving || !formData.endpoint || formData.scopes.length === 0}
                >
                  {isSaving && <LoadingSpinner style={{ width: '16px', height: '16px' }} />}
                  {editingWebhook ? 'Update' : 'Create'} Webhook
                </SubmitButton>
              </ButtonGroup>
            </Form>
          </Modal>
        </ModalOverlay>
      )}
    </>
  );
};

export default WebhookPage;
