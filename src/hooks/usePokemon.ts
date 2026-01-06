import { useQuery } from '@tanstack/react-query';
import type { Pokemon, PokemonSpecies, EvolutionChain, PokemonListItem, TypeRelations, MoveDetails } from '@/types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

export const usePokemon = (idOrName: string | number) => {
  return useQuery<Pokemon>({
    queryKey: ['pokemon', idOrName],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/pokemon/${idOrName.toString().toLowerCase()}`);
      if (!response.ok) throw new Error('Pokemon not found');
      return response.json();
    },
    enabled: !!idOrName,
    staleTime: 1000 * 60 * 10,
  });
};

export const usePokemonSpecies = (id: number) => {
  return useQuery<PokemonSpecies>({
    queryKey: ['pokemon-species', id],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/pokemon-species/${id}`);
      if (!response.ok) throw new Error('Species not found');
      return response.json();
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });
};

export const useEvolutionChain = (url: string | undefined) => {
  return useQuery<EvolutionChain>({
    queryKey: ['evolution-chain', url],
    queryFn: async () => {
      if (!url) throw new Error('No URL provided');
      const response = await fetch(url);
      if (!response.ok) throw new Error('Evolution chain not found');
      return response.json();
    },
    enabled: !!url,
    staleTime: 1000 * 60 * 10,
  });
};

export const usePokemonList = (limit: number = 1025, offset: number = 0) => {
  return useQuery<{ results: PokemonListItem[]; count: number }>({
    queryKey: ['pokemon-list', limit, offset],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
      if (!response.ok) throw new Error('Failed to fetch Pokemon list');
      return response.json();
    },
    staleTime: 1000 * 60 * 30,
  });
};

export const useTypeRelations = (typeName: string) => {
  return useQuery<TypeRelations>({
    queryKey: ['type-relations', typeName],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/type/${typeName}`);
      if (!response.ok) throw new Error('Type not found');
      const data = await response.json();
      return data.damage_relations;
    },
    enabled: !!typeName,
    staleTime: 1000 * 60 * 30,
  });
};

export const useMoveDetails = (moveUrl: string) => {
  return useQuery<MoveDetails>({
    queryKey: ['move', moveUrl],
    queryFn: async () => {
      const response = await fetch(moveUrl);
      if (!response.ok) throw new Error('Move not found');
      return response.json();
    },
    enabled: !!moveUrl,
    staleTime: 1000 * 60 * 30,
  });
};

export const getIdFromUrl = (url: string): number => {
  const parts = url.split('/').filter(Boolean);
  return parseInt(parts[parts.length - 1], 10);
};
