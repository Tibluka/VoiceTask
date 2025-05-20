import moment from 'moment';

export const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);

export const formatDate = (date: string) => moment(date).format('DD/MM/yyyy');