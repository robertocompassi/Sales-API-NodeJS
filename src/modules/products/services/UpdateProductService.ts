import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm";
import Product from "../typeorm/entities/Product";
import { ProductRepository } from "../typeorm/repositories/ProductsRepository";

interface IRequest {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

class UpdateProductService {
    public async execute({id, name, price, quantity}: IRequest) : Promise<Product > {
        const productsRepository = getCustomRepository(ProductRepository);
        
        const product = await productsRepository.findOne(id);
        
        if(!product) {
            throw new AppError('Produto não encontrado', 404)
        }

        const productExist = await productsRepository.findByName(name);

        if(productExist) {
            throw new AppError('Já existe produto com esse nome', 400);
        } 

        product.name = name;
        product.price = price;
        product.quantity = quantity;

        await productsRepository.save(product);

        return product;
    }
}

export default UpdateProductService