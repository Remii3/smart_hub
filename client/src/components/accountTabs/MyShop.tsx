import { useState } from 'react';
import PrimaryBtn from '../UI/Btns/PrimaryBtn';
import Modal from '../UI/modal/Modal';

function MyShop() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <PrimaryBtn
        text="New Product"
        usecase="normal"
        onClick={() => setIsOpen((prev) => !prev)}
      />
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex items-center justify-between">
          <label
            htmlFor="newProduct-name"
            className="mb-2 block text-dark dark:text-white"
          >
            Name
          </label>
          <span className="block text-sm text-gray-500">Optional</span>
        </div>
        <input
          id="newProduct-name"
          type="text"
          className="block w-full rounded-md px-4 py-3 text-base focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400"
          placeholder="A car..."
        />
      </Modal>
    </div>
  );
}

export default MyShop;
