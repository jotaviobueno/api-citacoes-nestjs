import { Article } from 'src/models/article.model';

export interface newArticle {
    article_id: string;
    author: string;
    content: string;
    total_likes: number;
    created_at: Date;
    updated_at: Date;
}

export function articleTransformer(articleStored: Article): newArticle {
    return {
        article_id: articleStored.article_id,
        author: articleStored.author,
        content: articleStored.content,
        total_likes: articleStored.total_likes,
        created_at: articleStored.created_at,
        updated_at: articleStored.updated_at,
    };
}
