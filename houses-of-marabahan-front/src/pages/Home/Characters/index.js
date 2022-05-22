import { useEffect, useState } from 'react';

import { List } from '../../../components/List/style';
import { CharacterPortrait } from '../../../components/CharacterPortrait/style';

import useHouse from '../../../hooks/useHouse';

import api from '../../../services/api';

import { supabase } from '../../../services/supabaseClient';

export default function Characters() {
  const { houseId } = useHouse();
  console.log(houseId);

  const [characters, setCharacters] = useState('');
  const characterBlobsHashtable = {};
  const [characterBlobs, setCharacterBlobs] = useState({});

  useEffect(() => {
    async function getCharacters() {
      const { data } = await api.findCharactersByHouse(houseId);
      setCharacters(data);
    }
    getCharacters();
  }, []);

  useEffect(() => {
    async function downloadImage(character) {
      try {
        if (character) {
          const { data } = await supabase.storage
            .from('/public/marabahani/kinds')
            .download(`${character.kind.name}.png`);
          const url = URL.createObjectURL(data);
          characterBlobsHashtable[character.name] = url;
        }
      } catch (error) {
        console.log(error);
      }
    }
    async function populateCharacterBlobs() {
      for (let character of characters) {
        if (!characterBlobsHashtable[character.name]) {
          await downloadImage(character);
        }
      }
      setCharacterBlobs(characterBlobsHashtable);
    }
    populateCharacterBlobs();
  }, [characters]);

  if (!characters) return '';
  return (
    <>
      <h3>Members</h3>
      {characters ? (
        <List>
          {characters.map((character) => (
            <div key={character.id} className='outline'>
              <CharacterPortrait image={characterBlobs[character.name]} />
              <div>
                <h2>{character.name}</h2>
                <p>Seeks {character.seeks}</p>
                <p>Fears {character.fears}</p>
              </div>
            </div>
          ))}
        </List>
      ) : (
        'Loading characters...'
      )}
    </>
  );
}
