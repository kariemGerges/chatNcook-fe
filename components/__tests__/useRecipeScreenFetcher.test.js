import { renderHook, act } from '@testing-library/react-hooks';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useRecipeScreenFetcher from '../..//hooks/useRecipeScreenFetcher'; // Adjust path as needed

jest.mock('axios');
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('useRecipeScreenFetcher Hook', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => useRecipeScreenFetcher());
    expect(result.current.recipes).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.refreshing).toBe(false);
  });

  it('fetches recipes and sets state correctly', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        data: [{ id: 1, name: 'Sample Recipe' }],
        currentPage: 1,
        totalPages: 1,
      },
    });

    const { result, waitForNextUpdate } = renderHook(() => useRecipeScreenFetcher());

    await waitForNextUpdate();

    expect(result.current.recipes).toEqual([{ id: 1, name: 'Sample Recipe' }]);
    expect(result.current.page).toBe(1);
    expect(result.current.totalPages).toBe(1);
  });

  it('handles errors correctly when fetch fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network Error'));

    const { result, waitForNextUpdate } = renderHook(() => useRecipeScreenFetcher());

    await waitForNextUpdate();

    expect(result.current.error).toBe('Failed to load recipes. Please try again later.');
  });
});
