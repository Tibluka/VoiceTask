import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { TextStyle, View } from 'react-native';


interface FormatTextOptions {
    baseStyle?: TextStyle | any;
    boldStyle?: TextStyle | any;
    bulletStyle?: TextStyle | any;
    lineSpacingStyle?: TextStyle;
}

export const renderFormattedText = (
    text: string,
    options: FormatTextOptions = {}
): React.ReactNode[] => {
    if (!text) return [];

    const {
        baseStyle = {},
        boldStyle = { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
        bulletStyle = { marginLeft: 8, marginVertical: 2 },
        lineSpacingStyle = { marginTop: 4 }
    } = options;

    // Divide o texto por quebras de linha
    const lines = text.split('\n');

    return lines.map((line, index) => {
        // Verifica se é um título (tem **)
        const isBold = line.includes('**');
        // Verifica se é um bullet point (começa com •)
        const isBullet = line.trim().startsWith('•');

        if (line.trim() === '') {
            // Linha vazia - adiciona espaçamento
            return <View key={index} style={{ height: 8 }
            } />;
        }

        let displayText = line;

        // Remove formatação ** para deixar apenas o texto
        if (isBold) {
            displayText = line.replace(/\*\*/g, '');
        }

        return (
            <ThemedText
                key={index}
                style={
                    [
                        baseStyle,
                        isBold && boldStyle,
                        isBullet && bulletStyle,
                        index > 0 && lineSpacingStyle
                    ]}
            >
                {displayText}
            </ThemedText>
        );
    });
};

/**
 * Remove formatação markdown do texto, mantendo apenas o conteúdo
 * 
 * @param text - Texto com formatação markdown
 * @returns Texto limpo sem formatação
 */
export const cleanMarkdownText = (text: string): string => {
    if (!text) return '';

    return text
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove ** mas mantém o texto
        .replace(/\n/g, '\n'); // Mantém quebras de linha
};

/**
 * Converte texto formatado para HTML simples (útil para WebView se necessário)
 * 
 * @param text - Texto com formatação
 * @returns HTML string
 */
export const textToHTML = (text: string): string => {
    if (!text) return '';

    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // ** para <strong>
        .replace(/\n/g, '<br/>') // \n para <br/>
        .replace(/• /g, '&bull; '); // • para HTML bullet
};

/**
 * Extrai apenas emojis de um texto
 * 
 * @param text - Texto que pode conter emojis
 * @returns Array de emojis encontrados
 */
export const extractEmojis = (text: string): string[] => {
    if (!text) return [];

    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
    return text.match(emojiRegex) || [];
};

/**
 * Conta palavras em um texto formatado
 * 
 * @param text - Texto a ser analisado
 * @returns Número de palavras
 */
export const countWords = (text: string): number => {
    if (!text) return 0;

    const cleanText = cleanMarkdownText(text);
    return cleanText.trim().split(/\s+/).length;
};

/**
 * Trunca texto mantendo formatação básica
 * 
 * @param text - Texto a ser truncado
 * @param maxLength - Tamanho máximo
 * @param ellipsis - Texto a ser adicionado no final
 * @returns Texto truncado
 */
export const truncateFormattedText = (
    text: string,
    maxLength: number = 100,
    ellipsis: string = '...'
): string => {
    if (!text || text.length <= maxLength) return text;

    return text.substring(0, maxLength - ellipsis.length) + ellipsis;
};