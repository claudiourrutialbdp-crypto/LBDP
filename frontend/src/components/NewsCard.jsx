import React from 'react';
import { Link } from 'react-router-dom';

const NewsCard = ({ news }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get main image from attachments
  const mainImage = news.attachments?.data?.[0]?.media?.image?.src || 'https://via.placeholder.com/400x200';
  const title = news.attachments?.data?.[0]?.title || 'Sin título';
  const excerpt = news.message?.substring(0, 120) + '...' || 'Sin descripción';

  return (
    <article className="card h-100 card-hover reveal">
      <img className="thumb" src={mainImage} alt={title} />
      <div className="card-body">
        <p className="text-muted small mb-1">{formatDate(news.created_time)}</p>
        <h3 className="h6 mb-2">{title}</h3>
        <p className="small text-secondary mb-3">{excerpt}</p>
        <Link to={`/noticia/${news.id}`} className="btn btn-sm btn-primary-liceo">
          Ver detalle
        </Link>
      </div>
    </article>
  );
};

export default NewsCard;