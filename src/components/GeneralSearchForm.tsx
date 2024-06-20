import React, { useState } from 'react';

const GeneralSearchForm: React.FC = () => {
  const [query, setQuery] = useState('');
  const [currentController, setCurrentController] = useState('yourControllerName'); // Substitua 'yourControllerName' pelo nome do seu controlador

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    // Você pode adicionar a lógica do reflex aqui, por exemplo:
    // triggerGeneralSearchReflex(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Lógica para enviar a pesquisa
    console.log('Search submitted:', { query, currentController });
    // Você pode adicionar a lógica do reflex aqui, por exemplo:
    // triggerGeneralSearchReflex(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        className="form-input bg-gray-700 text-white rounded px-2 py-1"
        placeholder="Search..."
      />
      <input
        type="hidden"
        name="current_controller"
        value={currentController}
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
      >
        Search
      </button>
    </form>
  );
};

export default GeneralSearchForm;
