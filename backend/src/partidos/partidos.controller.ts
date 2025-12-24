import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { PartidosService } from './partidos.service';

@Controller('partidos')
export class PartidosController {
    constructor(private readonly service: PartidosService) {}

    @Get()
    getAll() {
        return this.service.findAll();
    }

    @Post()
    create(@Body() body: any) {
        return this.service.create(body);
    }

    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.service.delete(id);
    }
}
