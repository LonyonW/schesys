import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContractType } from './contract-type.entity';
import { CreateContractTypeDto } from './dto/create-contract-type.dto';

@Injectable()
export class ContractTypesService {
  constructor(
    @InjectRepository(ContractType)
    private readonly contractTypeRepo: Repository<ContractType>,
  ) {}

  async create(data: CreateContractTypeDto): Promise<ContractType> {
    const existing = await this.contractTypeRepo.findOne({ where: { name: data.name } });
    if (existing) {
      throw new ConflictException('Contract type already exists');
    }
    const newType = this.contractTypeRepo.create(data);
    return this.contractTypeRepo.save(newType);
  }

  async findAll(): Promise<ContractType[]> {
    return this.contractTypeRepo.find();
  }
}
