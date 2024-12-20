import { expect } from 'chai';
import sinon from 'sinon';




const handleDeleteAccount = async () => {
    const userId = children;

    try {
        const response = await fetch(`http://localhost:5000/users/${userId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorDetails = await response.text();
            console.error('Response error details:', errorDetails);
            throw new Error('Failed to delete the account.');
        }

        alert('Account deleted successfully!');
        console.log('Redirecting to /Sign');
        router.push('/Sign');
    } catch (error) {
        console.error('Error deleting account:', error.message);
        alert('Error deleting account.');
    }
};




describe('handleDeleteAccount', () => {
  let fetchStub;
  let alertSpy;
  let routerPushMock;

  beforeEach(() => {
    // Check if alert is already a spy and do not spy again
    if (!global.alert || typeof global.alert.restore !== 'function') {
      alertSpy = sinon.spy(global, 'alert');
    } else {
      alertSpy = global.alert; // If it's already a spy, don't spy again
    }

    // Mocking fetch to intercept network requests
    fetchStub = sinon.stub(global, 'fetch');

    // Mocking router.push
    routerPushMock = sinon.spy();
    global.router = { push: routerPushMock };
  });

  afterEach(() => {
    // Ensure the alertSpy is restored properly
    if (alertSpy && typeof alertSpy.restore === 'function') {
      alertSpy.restore();
    }

    fetchStub.restore();
  });

  it('should delete the account successfully and redirect to /Sign', async () => {
    const userId = '123';

    // Mock the fetch response for a successful account deletion
    fetchStub.resolves({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ message: 'Account deleted successfully' }),
    });

    // Call the function
    await handleDeleteAccount(userId);

    // Assertions
    expect(alertSpy.calledOnceWith('Account deleted successfully!')).to.be.true;
    expect(routerPushMock.calledOnceWith('/Sign')).to.be.true;
    expect(fetchStub.calledOnceWith(`http://localhost:5000/users/${userId}`)).to.be.true;
  });

  it('should throw an error if account deletion fails (response.ok false)', async () => {
    const userId = '123';

    // Mock the fetch response for an error (status 400)
    fetchStub.resolves({
      ok: false,
      status: 400,
      text: () => Promise.resolve('Bad request'),
    });

    try {
      await handleDeleteAccount(userId);
    } catch (error) {
      // Check that the error was thrown
      expect(error.message).to.equal('Failed to delete the account.');
    }

    // Assertions
    expect(fetchStub.calledOnceWith(`http://localhost:5000/users/${userId}`)).to.be.true;
    expect(alertSpy.calledOnceWith('Error deleting account.')).to.be.true;
  });

  it('should handle fetch network error correctly', async () => {
    const userId = '123';

    // Mock fetch to reject with a network error
    fetchStub.rejects(new Error('Network error'));

    try {
      await handleDeleteAccount(userId);
    } catch (error) {
      // Check that the error was thrown
      expect(error.message).to.equal('Failed to delete the account.');
    }

    // Assertions
    expect(fetchStub.calledOnceWith(`http://localhost:5000/users/${userId}`)).to.be.true;
    expect(alertSpy.calledOnceWith('Error deleting account.')).to.be.true;
  });
});

describe('sideListDelete onClick', () => {
  let handleDeleteAccountSpy;

  beforeEach(() => {
    // Spy on the handleDeleteAccount function
    handleDeleteAccountSpy = sinon.spy(handleDeleteAccount);

    // Mocking fetch, alert, and router.push for sideListDelete
    fetchStub = sinon.stub(global, 'fetch');
    alertSpy = sinon.spy(global, 'alert');
    routerPushMock = sinon.spy();
    global.router = { push: routerPushMock };
  });

  afterEach(() => {
    // Ensure proper restoration of spies and stubs
    if (alertSpy && typeof alertSpy.restore === 'function') {
      alertSpy.restore();
    }
    fetchStub.restore();
  });

  it('should call handleDeleteAccount and then redirect to /Sign on success', async () => {
    const userId = '123';

    // Mock the fetch response for a successful account deletion
    fetchStub.resolves({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ message: 'Account deleted successfully' }),
    });

    // Trigger the onClick handler
    await sideListDelete.onClick(userId);

    // Assertions
    expect(handleDeleteAccountSpy.calledOnceWith(userId)).to.be.true;
    expect(alertSpy.calledOnceWith('Account deleted successfully!')).to.be.true;
    expect(routerPushMock.calledOnceWith('/Sign')).to.be.true;
    expect(fetchStub.calledOnceWith(`http://localhost:5000/users/${userId}`)).to.be.true;
  });

  it('should handle error in sideListDelete onClick if account deletion fails', async () => {
    const userId = '123';

    // Mock fetch to return an error
    fetchStub.resolves({
      ok: false,
      status: 400,
      text: () => Promise.resolve('Bad request'),
    });

    await sideListDelete.onClick(userId);

    // Assertions
    expect(alertSpy.calledOnceWith('Error deleting account.')).to.be.true;
    expect(fetchStub.calledOnceWith(`http://localhost:5000/users/${userId}`)).to.be.true;
  });
});
